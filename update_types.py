import re
with open('types.ts', 'r') as f:
    content = f.read()

video_type_pattern = r'    \| "Custom";'
video_type_replacement = '    | "Custom"\n    | "Live Stream";'
content = content.replace(video_type_pattern, video_type_replacement)

is_scheduled_pattern = r'  isScheduled\?: boolean;'
is_scheduled_replacement = '  isScheduled?: boolean;\n  isLive?: boolean;\n  liveViewers?: number;'
content = content.replace(is_scheduled_pattern, is_scheduled_replacement)

artist_data_pattern = r'  videos: Video\[\];'
artist_data_replacement = '''  videos: Video[];
  twitchStreams?: TwitchStreamSchedule[];
  hasStreamedWithKai?: boolean;'''
content = content.replace(artist_data_pattern, artist_data_replacement)

twitch_interface = '''
export type StreamLocation = 'Disneyworld' | 'Normal Stream' | 'LA Pop Up' | 'Petting Zoo';

export interface TwitchStreamSchedule {
    id: string;
    streamer: string;
    location: StreamLocation;
    songId: string;
    promoBanner: string;
    ytThumbnail: string;
    scheduledDate: GameDate;
    announceDate: GameDate;
    hasAnnounced: boolean;
    hasStreamed: boolean;
}
'''
content = content + twitch_interface

with open('types.ts', 'w') as f:
    f.write(content)
