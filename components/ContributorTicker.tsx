type ContributorTickerProps = {
  names: string[];
};

export function ContributorTicker({ names }: ContributorTickerProps) {
  const content = names.length ? `Thank you: ${names.join("  •  ")}` : "Thank you to all contributors";

  return (
    <nav className="ticker-shell ticker-sticky ticker-fullbleed bg-black px-0 py-1.5">
      <div className="ticker-track">
        <span>{content}</span>
        <span aria-hidden>{content}</span>
      </div>
    </nav>
  );
}
