export default function ButtonWithIcon({
  id,
  icon,
  onClick,
  active = false,
  activeBackgroundOverride = "",
  activeColorOverride = "",
  children,
}: {
  id?: string;
  icon?: string;
  onClick?: () => void;
  active?: boolean;
  activeBackgroundOverride?: string;
  activeColorOverride?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 text-sm rounded-lg transition-colors font-medium flex flex-col border ${
        active ? "bg-card-selected text-white" : "bg-card hover:bg-card-hover text-text"
      }`}
      style={
        active
          ? { backgroundColor: `${activeBackgroundOverride}`, color: `${activeColorOverride}` }
          : {}
      }
    >
      {icon && <span className={`m-auto block ${icon.length <= 2 ? "text-lg" : ""}`}>{icon}</span>}
      <span className="m-auto block">{children}</span>
    </button>
  );
}
