export function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 300,
        gap: 16,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          border: "4px solid #D7C5FF",
          borderTopColor: "#b89fe8",
          borderRadius: "50%",
          animation: "spin 0.9s linear infinite",
        }}
      />
      <p style={{ color: "#8a7a9a", fontSize: "0.9rem" }}>{message}</p>
      <style>{"@keyframes spin { to { transform: rotate(360deg); } }"}</style>
    </div>
  );
}

export function ErrorBanner({ message, onRetry }) {
  return (
    <div
      style={{
        background: "#FFCAD455",
        border: "1px solid #FFCAD4",
        borderRadius: 16,
        padding: "24px 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        margin: "24px 0",
      }}
    >
      <div>
        <p style={{ fontWeight: 700, color: "#5a4a6a", marginBottom: 4 }}>Could not load data</p>
        <p style={{ fontSize: "0.85rem", color: "#8a7a9a" }}>{message}</p>
        <p style={{ fontSize: "0.8rem", color: "#8a7a9a", marginTop: 4 }}>
          Make sure your backend is running on <code>localhost:8000</code> and your Olostep API key is set.
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            background: "#FFCAD4",
            border: "none",
            borderRadius: 16,
            padding: "10px 20px",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: "0.82rem",
            color: "#5a4a6a",
            whiteSpace: "nowrap",
          }}
        >
          Try Again
        </button>
      )}
    </div>
  );
}
