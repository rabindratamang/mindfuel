import csv
import json
from io import StringIO

def parse_youtube_csv_response(input_text):
    start_marker = "Y###"
    end_marker = "Y###"
    
    try:
        # Find the positions of the markers
        start_idx = input_text.index(start_marker) + len(start_marker)
        end_idx = input_text.index(end_marker, start_idx)
        
        # Extract the CSV content
        csv_content = input_text[start_idx:end_idx].strip()
        
        # Parse the CSV content
        csv_reader = csv.DictReader(StringIO(csv_content))
        
        # Convert to list of dictionaries (JSON-ready format)
        videos = []
        for row in csv_reader:
            # Clean up duration if needed (convert "18m 18s" to seconds)
            duration = row.get('duration', '')
            if 'm' in duration and 's' in duration:
                minutes, seconds = duration.split('m')
                seconds = seconds.replace('s', '').strip()
                duration_seconds = int(minutes) * 60 + int(seconds)
                row['duration_seconds'] = duration_seconds
            
            videos.append(row)
        
        return videos
    
    except ValueError:
        # Markers not found
        return []
    except Exception as e:
        print(f"Error parsing CSV: {e}")
        return []

# llm_response = """Here are some guided meditation videos that can help you reduce stress and anxiety:


# Y###

# title,url,duration,thumbnail_url

# GUIDED MEDITATION for Healing Anxiety, PTSD, Panic & Stress,https://www.youtube.com/watch?v=YzRUEmqDJd8,18m 18s,https://i.ytimg.com/vi/YzRUEmqDJd8/hqdefault.jpg

# Guided Meditation for Anxiety | The Hourglass,https://www.youtube.com/watch?v=pU80BEm43JM,8m 30s,https://i.ytimg.com/vi/pU80BEm43JM/hqdefault.jpg

# Meditation for Depression, Anxiety & Stress (Guided Relaxation),https://www.youtube.com/watch?v=1dbYduxIpwE,10m 53s,https://i.ytimg.com/vi/1dbYduxIpwE/hqdefault.jpg

# Guided Meditation For Anxiety | SURRENDER SESSION | Letting Go,https://www.youtube.com/watch?v=6arfMc9Aj4k,19m 29s,https://i.ytimg.com/vi/6arfMc9Aj4k/hqdefault.jpg

# Calm your anxiety in 40 minutes | Guided meditation,https://www.youtube.com/watch?v=fY9vX3YpI-M,39m 31s,https://i.ytimg.com/vi/fY9vX3YpI-M/hqdefault.jpg

# Y###


# Feel free to explore these videos and see which ones resonate with you. 🧘‍♂️✨ If you'd like more recommendations or specific topics, just let me know!"""

# videos_json = parse_youtube_csv_response(llm_response)
# print(json.dumps(videos_json, indent=2))