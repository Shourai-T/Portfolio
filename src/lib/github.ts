export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  topics: string[];
  created_at: string;
  updated_at: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
}

export interface TransformedRepo {
  id: string; // or number, keeping string for consistency with other IDs if needed, but repo IDs are numbers
  title: string;
  description: string;
  github_url: string;
  tech_stack: string[];
  branches: number; // We'll map forks to this or just use a random number/default since branch count isn't in simple repo API
  stars: number;
}

export async function fetchGitHubRepos(username: string): Promise<TransformedRepo[]> {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&direction=desc&per_page=8`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch GitHub repos");
    }

    const repos: GitHubRepo[] = await response.json();

    return repos.map((repo) => ({
      id: repo.id.toString(),
      title: repo.name.replace(/-/g, " ").replace(/_/g, " "), // Pretty title
      description: repo.description || "No description provided.",
      github_url: repo.html_url,
      tech_stack: repo.topics.length > 0 ? repo.topics : [repo.language || "Code"],
      branches: 1, // API doesn't return branch count easily, defaulting to 1
      stars: repo.stargazers_count,
    }));
  } catch (error) {
    console.error("Error creating GitHub client:", error);
    return [];
  }
}
