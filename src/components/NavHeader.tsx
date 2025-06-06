import { NavLink } from "react-router-dom";
import { TilosLogo } from "./icons";
import ButtonWithIcon from "./ui/ButtonWithIcon";

export default function NavHeader() {
  return (
    <div className="container mx-auto px-2 py-2">
      <nav className="flex items-center justify-between">
        <NavLink style={{ flex: "none" }} to="/">
          <TilosLogo className="h-16 w-16" />
        </NavLink>
        <NavLink
          to="/"
          className="hidden sm:block text-xl font-bold text-main hover:text-accent transition-colors"
        >
          <span>Tilos Maraton 2025</span>
        </NavLink>
        <div className="flex items-center gap-2 mr-4">
          <NavLink
            to="/info"
            className={({ isActive }) =>
              `rounded-md text-sm text-center font-medium transition-colors ${
                isActive
                  ? "bg-accent/10 text-accent"
                  : "text-muted hover:text-accent"
              }`
            }
          >
            <ButtonWithIcon icon={"ℹ️"}>Info</ButtonWithIcon>
          </NavLink>
          <NavLink
            to="/search"
            className={({ isActive }) =>
              `w-16 rounded-md text-sm text-center font-medium transition-colors ${
                isActive
                  ? "bg-accent/10 text-accent"
                  : "text-muted hover:text-accent"
              }`
            }
          >
            <ButtonWithIcon icon={"🔍"}>Keresés</ButtonWithIcon>
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
