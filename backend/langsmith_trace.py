import json
import os
from typing import Optional, Dict, Any
from datetime import datetime
from langsmith import Client
from langsmith.utils import LangSmithAuthError


def export_langsmith_trace(
    run_id: str,
    output_dir: str = "langsmith_exports",
    api_key: Optional[str] = None,
    include_metadata: bool = True,
    pretty_print: bool = True
) -> Dict[str, Any]:
    """
    Export a LangSmith trace to JSON format.
    
    Args:
        run_id (str): The LangSmith run ID to export
        output_dir (str): Directory to save the JSON file (default: "langsmith_exports")
        api_key (str, optional): LangSmith API key. If not provided, will use environment variable
        include_metadata (bool): Whether to include export metadata in the JSON
        pretty_print (bool): Whether to format JSON with indentation
    
    Returns:
        Dict[str, Any]: Result dictionary with status and file path
    """
    try:
        # Create output directory if it doesn't exist
        os.makedirs(output_dir, exist_ok=True)
        
        # Initialize LangSmith client
        if api_key:
            client = Client(api_key=api_key)
        else:
            client = Client()
        
        # Get the run data
        run = client.read_run(run_id)
        
        # Convert run to dictionary
        run_data = run.dict()
        
        # Add export metadata if requested
        if include_metadata:
            export_metadata = {
                "export_info": {
                    "exported_at": datetime.utcnow().isoformat(),
                    "run_id": run_id,
                    "export_version": "1.0",
                    "include_metadata": include_metadata
                }
            }
            run_data.update(export_metadata)
        
        # Generate filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"langsmith_trace_{run_id}_{timestamp}.json"
        filepath = os.path.join(output_dir, filename)
        
        # Write to JSON file
        with open(filepath, 'w', encoding='utf-8') as f:
            if pretty_print:
                json.dump(run_data, f, indent=2, ensure_ascii=False, default=str)
            else:
                json.dump(run_data, f, ensure_ascii=False, default=str)
        
        return {
            "success": True,
            "filepath": filepath,
            "filename": filename,
            "run_id": run_id,
            "message": f"Successfully exported trace to {filepath}"
        }
        
    except LangSmithAuthError as e:
        return {
            "success": False,
            "error": "Authentication failed",
            "details": str(e),
            "run_id": run_id,
            "message": "Please check your LangSmith API key"
        }
    except Exception as e:
        return {
            "success": False,
            "error": "Export failed",
            "details": str(e),
            "run_id": run_id,
            "message": f"Failed to export trace: {str(e)}"
        }


def export_multiple_traces(
    run_ids: list[str],
    output_dir: str = "langsmith_exports",
    api_key: Optional[str] = None,
    include_metadata: bool = True,
    pretty_print: bool = True
) -> Dict[str, Any]:
    """
    Export multiple LangSmith traces to JSON format.
    
    Args:
        run_ids (list[str]): List of LangSmith run IDs to export
        output_dir (str): Directory to save the JSON files
        api_key (str, optional): LangSmith API key
        include_metadata (bool): Whether to include export metadata
        pretty_print (bool): Whether to format JSON with indentation
    
    Returns:
        Dict[str, Any]: Summary of export results
    """
    results = {
        "successful": [],
        "failed": [],
        "total": len(run_ids),
        "summary": {}
    }
    
    for run_id in run_ids:
        result = export_langsmith_trace(
            run_id=run_id,
            output_dir=output_dir,
            api_key=api_key,
            include_metadata=include_metadata,
            pretty_print=pretty_print
        )
        
        if result["success"]:
            results["successful"].append(result)
        else:
            results["failed"].append(result)
    
    # Add summary
    results["summary"] = {
        "total_processed": len(run_ids),
        "successful_exports": len(results["successful"]),
        "failed_exports": len(results["failed"]),
        "success_rate": len(results["successful"]) / len(run_ids) if run_ids else 0
    }
    
    return results


# Example usage and CLI interface
if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Export LangSmith traces to JSON")
    parser.add_argument("run_id", help="LangSmith run ID to export")
    parser.add_argument("--output-dir", default="langsmith_exports", help="Output directory")
    parser.add_argument("--api-key", help="LangSmith API key")
    parser.add_argument("--no-metadata", action="store_true", help="Exclude export metadata")
    parser.add_argument("--no-pretty", action="store_true", help="Disable pretty printing")
    
    args = parser.parse_args()
    
    result = export_langsmith_trace(
        run_id=args.run_id,
        output_dir=args.output_dir,
        api_key=args.api_key,
        include_metadata=not args.no_metadata,
        pretty_print=not args.no_pretty
    )
    
    if result["success"]:
        print(f"{result['message']}")
    else:
        print(f"{result['message']}")
        print(f"Error: {result['error']}")
        if result.get('details'):
            print(f"Details: {result['details']}")


# example usage
# python langsmith_trace.py 1234567890 --output-dir langsmith_exports --api-key your_api_key