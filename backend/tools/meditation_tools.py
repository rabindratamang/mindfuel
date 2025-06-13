from langchain_core.tools import tool
import random

@tool
def guided_meditation_tool2(style: str = "mindfulness", duration: int = 10, intensity: str = "relaxing") -> str:
    """
    Generate a dynamic, step-by-step guided meditation session with varied instructions and timed breaks.

    Args:
        style (str): Type of meditation ('mindfulness', 'breathing', or 'body_scan').
        duration (int): Total duration in minutes.
        intensity (str): Type of mood or tone ('relaxing', 'energizing').

    Returns:
        str: A multi-step, varied meditation script.
    """
    # Define intensity tone modifiers
    tone_prefix = {
        "relaxing": "Gently",
        "energizing": "With alert awareness"
    }

    # Define steps by meditation style
    instructions = {
        "mindfulness": [
            "observe your thoughts as they arise.",
            "bring awareness to your breath without trying to control it.",
            "notice the sensations in your body.",
            "focus on the feeling of the air against your skin.",
            "be fully present with each sound you hear.",
            "watch your thoughts pass like clouds in the sky.",
            "feel grounded by the contact between your body and the seat."
        ],
        "breathing": [
            "breathe in deeply through your nose, out through your mouth.",
            "use box breathing: inhale, hold, exhale, hold — all for 4 counts.",
            "let your breath become slower and deeper.",
            "place one hand on your chest, the other on your belly, and feel your breath.",
            "count each breath cycle: in and out equals one.",
            "pause after each inhale and exhale, feeling stillness.",
            "anchor your awareness in the rhythm of your breath."
        ],
        "body_scan": [
            "relax your forehead and soften your jaw.",
            "release tension from your shoulders.",
            "feel your chest rise and fall naturally.",
            "observe any sensations in your abdomen.",
            "notice your legs and let them become heavy.",
            "feel into your toes and feet — relax completely.",
            "move attention slowly from head to toe."
        ]
    }

    if style not in instructions:
        return "❌ Unknown meditation style. Choose from: 'mindfulness', 'breathing', or 'body_scan'."

    if intensity not in tone_prefix:
        return "❌ Unknown intensity. Choose from: 'relaxing', 'energizing'."

    steps = random.sample(instructions[style], k=min(len(instructions[style]), duration))
    pause_time = duration // len(steps)

    # Tone-based intro
    response = f"🧘 {style.title()} Meditation ({intensity.title()}) for {duration} minutes:\n"

    for i, step in enumerate(steps, 1):
        prefix = tone_prefix[intensity]
        response += f"\n{i}. {prefix}, {step}\n⏸️ Pause for ~{pause_time} minutes...\n"

    # Dynamic closings
    closing_relaxing = [
        "Gently bring your awareness back to the present.",
        "Wiggle your fingers and toes softly.",
        "Open your eyes when you're ready.",
        "Notice how your body feels now compared to when you started."
    ]
    closing_energizing = [
        "Take a deep breath and feel refreshed.",
        "Open your eyes with energy and clarity.",
        "Stretch your arms and prepare to move forward with focus.",
        "Smile and carry this awareness into the rest of your day."
    ]

    closing = random.choice(closing_relaxing if intensity == "relaxing" else closing_energizing)
    response += f"\n🔚 Final Step: {closing}"

    return response.strip()
