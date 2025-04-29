const Logo = ({ className = "" }) => {
    return (
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <circle cx="20" cy="20" r="20" fill="#1E293B" />
        <path
          d="M20 5C11.716 5 5 11.716 5 20C5 28.284 11.716 35 20 35C28.284 35 35 28.284 35 20C35 11.716 28.284 5 20 5ZM20 8C26.627 8 32 13.373 32 20C32 26.627 26.627 32 20 32C13.373 32 8 26.627 8 20C8 13.373 13.373 8 20 8Z"
          fill="white"
        />
        <circle cx="20" cy="20" r="5" fill="white" />
        <path d="M20 10L22 15H18L20 10Z" fill="white" />
        <path d="M20 30L18 25H22L20 30Z" fill="white" />
        <path d="M10 20L15 18V22L10 20Z" fill="white" />
        <path d="M30 20L25 22V18L30 20Z" fill="white" />
      </svg>
    )
  }
  
  export default Logo
  
  