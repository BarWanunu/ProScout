/* ------------------------------------------------------------------
   Smart-Recommender – filter card (CSS version)
------------------------------------------------------------------ */
"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Slider,
} from "../../../../components/ui";
import { Zap, Filter } from "lucide-react";

import "./RecommendationFilter.css"; 

export default function RecommendationFilter(props) {
  const {
    formation,
    position,
    ageRange,
    lineBreaking,
    sortBy,
    playersFound,
    isLoading,
    setFormation,
    setPosition,
    setAgeRange,
    setLineBreaking,
    setSortBy,
    onApply,
  } = props;

  return (
    <Card className="rf-card text-black">
      <CardHeader>
        <CardTitle className="rf-title">
          <Zap className="rf-zap" />
          Smart Player Recommender
        </CardTitle>

        <CardDescription className="rf-desc">
          Find the perfect players to fill gaps in your squad based on your
          tactical needs
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* ───────────────── Controls grid ──────────────────────── */}
        <div className="rf-grid">
          {/* Formation */}
          <div className="rf-block">
            <label className="rf-label">Formation</label>
            <Select value={formation} onValueChange={setFormation}>
              <SelectTrigger className="rf-select-trigger">
              </SelectTrigger>
              <SelectContent>
                {["4-3-3", "4-2-3-1", "3-5-2", "4-4-2"].map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Position */}
          <div className="rf-block">
            <label className="rf-label">Position</label>
            <Select value={position} onValueChange={setPosition}>
              <SelectTrigger className="rf-select-trigger">
              </SelectTrigger>
              <SelectContent>
                {["GK", "CB", "FB", "DM", "CM", "AM", "W", "ST"].map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Age range */}
          <div className="rf-block">
            <label className="rf-label">
              Age Range: {ageRange[0]}-{ageRange[1]}
            </label>
            <Slider
              className="rf-slider"
              value={ageRange}
              min={16}
              max={40}
              step={1}
              onValueChange={setAgeRange}
            />
          </div>

          {/* Line-breaking */}
          <div className="rf-block">
            <label className="rf-label">
              Line-Breaking &gt; {lineBreaking}-th&nbsp;%
            </label>
            <Slider
              className="rf-slider"
              value={[lineBreaking]}
              min={50}
              max={99}
              step={1}
              onValueChange={(v) => setLineBreaking(v[0])}
            />
          </div>
        </div>

        {/* ────────────── Sort + apply row ──────────────────────── */}
        <div className="rf-footer">
          <div className="rf-sort">
            <div className="rf-block">
              <label className="rf-label">Sort by</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="rf-select-trigger rf-w40">
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="matchScore">Match Score</SelectItem>
                  <SelectItem value="age">Age</SelectItem>
                  <SelectItem value="marketValue">Market Value</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <span className="rf-muted">{playersFound} players found</span>
          </div>

          <Button
            className="rf-apply"
            onClick={onApply}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="rf-spinner" />
            ) : (
              <Filter className="rf-filter-icon" />
            )}
            Apply&nbsp;Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
