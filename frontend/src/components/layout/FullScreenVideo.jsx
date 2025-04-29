const FullScreenVideo = ({ src, ...props }) => (
    <video
      src={src}
      loop
      muted
      autoPlay
      playsInline
      className="background-video"
      {...props}
    />
  );
  export default FullScreenVideo;
  