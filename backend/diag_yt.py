import youtube_transcript_api

def diagnose():
    print(f"File: {youtube_transcript_api.__file__}")
    print(f"Dir: {dir(youtube_transcript_api)}")
    try:
        from youtube_transcript_api import YouTubeTranscriptApi
        print(f"YouTubeTranscriptApi Dir: {dir(YouTubeTranscriptApi)}")
    except Exception as e:
        print(f"Import failed: {e}")

if __name__ == "__main__":
    diagnose()
