import React from 'react';
import { Play, Video } from 'lucide-react';
import '../styles/PlayerHighlightsTab.css';

const PlayerHighlightsTab = ({ player }) => {
  const isValidVideoUrl = (url) => {
    if (!url) return false;
    
    // Check for YouTube URL patterns
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    
    // Check for local uploaded files
    if (url.startsWith('uploads/')) return true;
    
    // Check for other video formats
    const videoExtensions = /\.(mp4|avi|mov|wmv|flv|webm)$/i;
    
    return youtubeRegex.test(url) || videoExtensions.test(url) || url.startsWith('http');
  };

  const getEmbedUrl = (url) => {
    if (!url) return null;
    
    // Convert YouTube watch URLs to embed URLs
    const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    
    // Handle local uploaded files (relative paths)
    if (url.startsWith('uploads/')) {
      return `http://localhost:3000/${url}`;
    }
    
    // Return original URL for other formats
    return url;
  };

  const renderVideoPlayer = () => {
    if (!player?.video || !isValidVideoUrl(player.video)) {
      return (
        <div className="no-highlights">
          <Video size={64} className="no-highlights-icon" />
          <h3>No Highlights Available</h3>
          <p>Performance highlights will appear here once uploaded.</p>
        </div>
      );
    }

    const embedUrl = getEmbedUrl(player.video);
    
    // Check if it's a YouTube embed
    if (embedUrl.includes('youtube.com/embed')) {
      return (
        <div className="video-container">
          <div className="video-wrapper">
            <iframe
              src={embedUrl}
              title={`${player.name || 'Player'} Highlights`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="video-info">
            <h3 className="video-title">
              <Play size={20} className="play-icon" />
              {player.name}'s Performance Highlights
            </h3>
            <p className="video-description">
              Watch {player.name}'s best moments on the field
            </p>
          </div>
        </div>
      );
    }

    // For other video formats (including local files)
    return (
      <div className="video-container">
        <div className="video-wrapper">
          <video 
            controls 
            className="video-player"
            onError={(e) => {
              console.error('Video failed to load:', embedUrl, e);
            }}
          >
            <source src={embedUrl} type="video/mp4" />
            <source src={embedUrl} type="video/webm" />
            <source src={embedUrl} type="video/ogg" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="video-info">
          <h3 className="video-title">
            <Play size={20} className="play-icon" />
            {player.name}'s Performance Highlights
          </h3>
          <p className="video-description">
            Watch {player.name}'s best moments on the field
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="player-highlights-tab">
      <div className="highlights-header">
        <h2>Performance Highlights</h2>
        <p>Showcase your best moments on the field</p>
      </div>
      
      <div className="highlights-content">
        {renderVideoPlayer()}
      </div>
    </div>
  );
};

export default PlayerHighlightsTab;