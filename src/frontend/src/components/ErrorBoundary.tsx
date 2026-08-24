import { Button } from "@/components/ui/button";
import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Rendered instead of the default panel when the subtree throws. */
  fallback?: ReactNode;
  /** Short label naming what failed, used in the default panel. */
  label?: string;
}

interface State {
  hasError: boolean;
}

/**
 * Catches render/lifecycle crashes in a subtree so one broken component
 * (a failed lazy chunk, an unsupported WebGL context) degrades to a
 * branded panel instead of unmounting the whole page.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Avalon Ice: subtree crashed", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    return (
      <div
        data-ocid="error_boundary.fallback"
        role="alert"
        className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-16 text-center"
      >
        <h2 className="script-heading text-3xl">Something went sideways.</h2>
        <p className="font-body text-sm leading-relaxed text-lagoon">
          {this.props.label
            ? `We couldn't load ${this.props.label}. Everything else on the page still works.`
            : "This part of the page failed to load. Try reloading — and if it keeps happening, give us a call."}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            type="button"
            onClick={() => window.location.reload()}
            className="btn-brutal btn-brutal-ice min-h-12 bg-navy px-6 font-body text-sm font-bold uppercase tracking-[0.1em] text-cream-bright hover:bg-navy"
          >
            Reload
          </Button>
          <Button
            asChild
            className="btn-brutal min-h-12 bg-cream-bright px-6 font-body text-sm font-bold uppercase tracking-[0.1em] text-navy hover:bg-ice-frost"
          >
            <a href="tel:8563089986">Call (856) 308-9986</a>
          </Button>
        </div>
      </div>
    );
  }
}
