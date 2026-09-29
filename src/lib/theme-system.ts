export type AppThemeId = "sunset" | "midnight" | "ocean" | "cherry" | "matcha" | "monochrome";

export type AppTheme = {
  id: AppThemeId;
  name: string;
  description: string;
  premium: boolean;
  colors: [string, string, string, string];
  tokens: Record<string, string>;
};

export const APP_THEMES: AppTheme[] = [
  { id: "sunset", name: "Sunset Kitchen", description: "Warm, welcoming and made for everyday cooking.", premium: false, colors: ["#351E35", "#C65D3A", "#F3A77A", "#FFF8F1"], tokens: { background: "#FFF8F1", foreground: "#211A1A", card: "#FFFFFF", primary: "#351E35", primaryForeground: "#FFF8F1", secondary: "#F3A77A", secondaryForeground: "#351E35", muted: "#F7EDE5", mutedForeground: "#786B68", accent: "#C65D3A", border: "#E8D8CE", input: "#E8D8CE", ring: "#C65D3A", cream: "#FFF8F1", ink: "#351E35", ember: "#C65D3A", leaf: "#7D9B76" } },
  { id: "midnight", name: "Midnight", description: "Quiet contrast for late-night kitchen sessions.", premium: true, colors: ["#111014", "#351E35", "#B9A7E8", "#F7F5FA"], tokens: { background: "#111014", foreground: "#F7F5FA", card: "#1C1821", primary: "#B9A7E8", primaryForeground: "#211A1A", secondary: "#351E35", secondaryForeground: "#F7F5FA", muted: "#29232F", mutedForeground: "#B7AFBF", accent: "#B9A7E8", border: "#403747", input: "#403747", ring: "#B9A7E8", cream: "#F7F5FA", ink: "#F7F5FA", ember: "#B9A7E8", leaf: "#8E7AC2" } },
  { id: "ocean", name: "Ocean", description: "Cool, clear and refreshing.", premium: true, colors: ["#102A43", "#1976A8", "#A9E4F5", "#F4FBFD"], tokens: { background: "#F4FBFD", foreground: "#102A43", card: "#FFFFFF", primary: "#102A43", primaryForeground: "#F4FBFD", secondary: "#A9E4F5", secondaryForeground: "#102A43", muted: "#E5F4F8", mutedForeground: "#58727F", accent: "#1976A8", border: "#C7E4EC", input: "#C7E4EC", ring: "#1976A8", cream: "#F4FBFD", ink: "#102A43", ember: "#1976A8", leaf: "#70B9CA" } },
  { id: "cherry", name: "Cherry", description: "Rich, expressive and full of character.", premium: true, colors: ["#481927", "#C13B52", "#F4A6B5", "#FFF7F1"], tokens: { background: "#FFF7F1", foreground: "#32151D", card: "#FFFFFF", primary: "#481927", primaryForeground: "#FFF7F1", secondary: "#F4A6B5", secondaryForeground: "#481927", muted: "#FCE8EA", mutedForeground: "#7E6268", accent: "#C13B52", border: "#F0CDD2", input: "#F0CDD2", ring: "#C13B52", cream: "#FFF7F1", ink: "#481927", ember: "#C13B52", leaf: "#A76C76" } },
  { id: "matcha", name: "Matcha", description: "Grounded greens for a slower, softer rhythm.", premium: true, colors: ["#173B2B", "#7BAE63", "#B9D7A4", "#FFF9EF"], tokens: { background: "#FFF9EF", foreground: "#173B2B", card: "#FFFFFF", primary: "#173B2B", primaryForeground: "#FFF9EF", secondary: "#B9D7A4", secondaryForeground: "#173B2B", muted: "#EDF4E8", mutedForeground: "#607565", accent: "#7BAE63", border: "#D5E5CD", input: "#D5E5CD", ring: "#7BAE63", cream: "#FFF9EF", ink: "#173B2B", ember: "#7BAE63", leaf: "#7BAE63" } },
  { id: "monochrome", name: "Monochrome", description: "A crisp, timeless kitchen canvas.", premium: true, colors: ["#111111", "#444444", "#BDBDBD", "#F4F4F4"], tokens: { background: "#F4F4F4", foreground: "#111111", card: "#FFFFFF", primary: "#111111", primaryForeground: "#FFFFFF", secondary: "#BDBDBD", secondaryForeground: "#111111", muted: "#E9E9E9", mutedForeground: "#666666", accent: "#444444", border: "#D2D2D2", input: "#D2D2D2", ring: "#444444", cream: "#F4F4F4", ink: "#111111", ember: "#444444", leaf: "#777777" } },
];

export const DEFAULT_APP_THEME: AppThemeId = "sunset";
export const APP_THEME_STORAGE_KEY = "mealmate-app-theme";

export function getAppTheme(id: AppThemeId) {
  return APP_THEMES.find((theme) => theme.id === id) ?? APP_THEMES[0];
}
