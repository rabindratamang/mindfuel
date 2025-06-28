from typing import Optional, Dict, Any, List
from datetime import datetime, timedelta
from models.user import UserRepository, User, UserInDB
from core.security import hash_password, verify_password
import re


class UserHelpers:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    async def validate_user_registration(self, email: str, password: str, first_name: str, last_name: str) -> Dict[str, Any]:
        """
        Validate user registration data
        Returns: {"valid": bool, "errors": List[str]}
        """
        errors = []
        
        # Email validation
        if not self._is_valid_email(email):
            errors.append("Invalid email format")
        elif await self.user_repository.check_email_exists(email):
            errors.append("Email already registered")
        
        # Password validation
        password_errors = self._validate_password(password)
        errors.extend(password_errors)
        
        # Name validation
        if not first_name or len(first_name.strip()) < 2:
            errors.append("First name must be at least 2 characters long")
        if not last_name or len(last_name.strip()) < 2:
            errors.append("Last name must be at least 2 characters long")
        
        return {
            "valid": len(errors) == 0,
            "errors": errors
        }

    async def validate_user_login(self, email: str, password: str) -> Dict[str, Any]:
        errors = []
        user = None
        
        if not email or not password:
            errors.append("Email and password are required")
            return {"valid": False, "user": None, "errors": errors}
        
        user = await self.user_repository.get_by_email(email)
        if not user:
            errors.append("Invalid credentials")
        elif not verify_password(password, user.hashedPassword):
            errors.append("Invalid credentials")
        
        return {
            "valid": len(errors) == 0,
            "user": user,
            "errors": errors
        }

    async def update_user_profile(self, user_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update user profile with validation
        Returns: {"success": bool, "user": Optional[User], "errors": List[str]}
        """
        errors = []
        
        # Validate allowed fields
        allowed_fields = {"firstName", "lastName", "email"}
        invalid_fields = set(updates.keys()) - allowed_fields
        if invalid_fields:
            errors.append(f"Invalid fields: {', '.join(invalid_fields)}")
        
        # Validate email if being updated
        if "email" in updates:
            if not self._is_valid_email(updates["email"]):
                errors.append("Invalid email format")
            elif await self.user_repository.check_email_exists(updates["email"]):
                # Check if it's not the same user
                current_user = await self.user_repository.get_by_id(user_id)
                if current_user and current_user.email != updates["email"]:
                    errors.append("Email already registered")
        
        # Validate names if being updated
        if "firstName" in updates and (not updates["firstName"] or len(updates["firstName"].strip()) < 2):
            errors.append("First name must be at least 2 characters long")
        if "lastName" in updates and (not updates["lastName"] or len(updates["lastName"].strip()) < 2):
            errors.append("Last name must be at least 2 characters long")
        
        if errors:
            return {"success": False, "user": None, "errors": errors}
        
        # Update user
        success = await self.user_repository.update(user_id, updates)
        if not success:
            errors.append("User not found")
            return {"success": False, "user": None, "errors": errors}
        
        updated_user = await self.user_repository.get_user_for_response(user_id)
        return {"success": True, "user": updated_user, "errors": []}

    async def change_user_password(self, user_id: str, current_password: str, new_password: str) -> Dict[str, Any]:
        """
        Change user password with validation
        Returns: {"success": bool, "errors": List[str]}
        """
        errors = []
        
        # Get current user
        user = await self.user_repository.get_by_id(user_id)
        if not user:
            errors.append("User not found")
            return {"success": False, "errors": errors}
        
        # Verify current password
        if not verify_password(current_password, user.hashedPassword):
            errors.append("Current password is incorrect")
            return {"success": False, "errors": errors}
        
        # Validate new password
        password_errors = self._validate_password(new_password)
        if password_errors:
            errors.extend(password_errors)
            return {"success": False, "errors": errors}
        
        # Update password
        hashed_new_password = hash_password(new_password)
        success = await self.user_repository.update_password(user_id, hashed_new_password)
        
        return {"success": success, "errors": []}

    async def get_user_analytics(self, user_id: str, days: int = 30) -> Dict[str, Any]:
        """
        Get user analytics and statistics
        Returns: {"user": User, "analytics": Dict[str, Any]}
        """
        user = await self.user_repository.get_user_for_response(user_id)
        if not user:
            return {"user": None, "analytics": {}}
        
        # Calculate user age in days
        user_age_days = (datetime.utcnow() - user.createdAt).days
        
        analytics = {
            "account_age_days": user_age_days,
            "account_age_months": user_age_days // 30,
            "last_updated_days_ago": (datetime.utcnow() - user.updatedAt).days,
            "is_active": user_age_days <= 365,  # Consider active if account is less than a year old
            "profile_completeness": self._calculate_profile_completeness(user)
        }
        
        return {"user": user, "analytics": analytics}

    async def get_users_summary(self, limit: int = 10) -> Dict[str, Any]:
        """
        Get summary of users for admin dashboard
        Returns: {"total_users": int, "recent_users": List[User], "stats": Dict[str, Any]}
        """
        total_users = await self.user_repository.count_users()
        recent_users = await self.user_repository.get_recent_users(limit)
        stats = await self.user_repository.get_user_stats()
        
        return {
            "total_users": total_users,
            "recent_users": recent_users,
            "stats": stats
        }

    def _is_valid_email(self, email: str) -> bool:
        """Validate email format"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, email))

    def _validate_password(self, password: str) -> List[str]:
        """Validate password strength"""
        errors = []
        
        if len(password) < 8:
            errors.append("Password must be at least 8 characters long")
        if not re.search(r'[A-Z]', password):
            errors.append("Password must contain at least one uppercase letter")
        if not re.search(r'[a-z]', password):
            errors.append("Password must contain at least one lowercase letter")
        if not re.search(r'\d', password):
            errors.append("Password must contain at least one number")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            errors.append("Password must contain at least one special character")
        
        return errors

    def _calculate_profile_completeness(self, user: User) -> int:
        """Calculate profile completeness percentage"""
        fields = [user.firstName, user.lastName, user.email]
        completed_fields = sum(1 for field in fields if field and field.strip())
        return int((completed_fields / len(fields)) * 100)

    async def bulk_user_operations(self, operation: str, user_ids: List[str], **kwargs) -> Dict[str, Any]:
        """
        Perform bulk operations on users
        Supported operations: "delete", "deactivate", "activate"
        """
        results = {"success": [], "failed": []}
        
        for user_id in user_ids:
            try:
                if operation == "delete":
                    success = await self.user_repository.delete(user_id)
                elif operation == "deactivate":
                    success = await self.user_repository.update(user_id, {"isActive": False})
                elif operation == "activate":
                    success = await self.user_repository.update(user_id, {"isActive": True})
                else:
                    results["failed"].append({"user_id": user_id, "error": "Invalid operation"})
                    continue
                
                if success:
                    results["success"].append(user_id)
                else:
                    results["failed"].append({"user_id": user_id, "error": "Operation failed"})
                    
            except Exception as e:
                results["failed"].append({"user_id": user_id, "error": str(e)})
        
        return results 