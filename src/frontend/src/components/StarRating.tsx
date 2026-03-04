import { Star } from "lucide-react";

interface StarRatingProps {
  score: number;
  max?: number;
  size?: number;
  className?: string;
}

export function StarRating({
  score,
  max = 5,
  size = 14,
  className = "",
}: StarRatingProps) {
  return (
    <span className={`flex items-center gap-0.5 ${className}`}>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          // biome-ignore lint/suspicious/noArrayIndexKey: star position is stable index
          key={i}
          size={size}
          className={
            i < score
              ? "fill-yellow-400 text-yellow-400"
              : "fill-transparent text-muted-foreground"
          }
        />
      ))}
    </span>
  );
}

export function AverageStars({
  ratings,
  className = "",
}: {
  ratings: { score: number }[];
  className?: string;
}) {
  const avg =
    ratings.length > 0
      ? ratings.reduce((s, r) => s + r.score, 0) / ratings.length
      : 0;
  return (
    <span className={`flex items-center gap-1.5 ${className}`}>
      <StarRating score={Math.round(avg)} />
      <span className="text-xs text-muted-foreground">
        {avg.toFixed(1)} ({ratings.length})
      </span>
    </span>
  );
}
