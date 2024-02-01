export const Icon = ({ onClick, children }) => {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "6px",
        backgroundColor: "gray",
        width: "max-content",
        borderRadius: "100%",
        display: "flex",
      }}
    >
      {children}
    </div>
  );
};
