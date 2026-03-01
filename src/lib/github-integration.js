// src/lib/github-integration.js

/**
 * GitHub Integration Layer
 * 
 * Provides utilities for interacting with GitHub API, managing branches,
 * issues, and facilitating workflow communication in agentic systems.
 */
export class GitHubIntegration {
  constructor(options = {}) {
    this.token = options.githubToken;
    this.owner = options.owner;
    this.repo = options.repository;
    this.baseURL = options.baseURL || "https://api.github.com";
    
    if (!this.token) {
      console.warn("GitHub token not provided. Some functionality may be limited.");
    }
  }

  /**
   * Make authenticated request to GitHub API
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      "Accept": "application/vnd.github.v3+json",
      "User-Agent": "agentic-lib/1.0.0",
      ...options.headers,
    };

    if (this.token) {
      headers["Authorization"] = `token ${this.token}`;
    }

    const config = {
      method: options.method || "GET",
      headers,
      ...options,
    };

    if (options.body) {
      config.body = JSON.stringify(options.body);
      headers["Content-Type"] = "application/json";
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`GitHub API error: ${response.status} ${error}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`GitHub API request failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create a new branch for agentic workflow communication
   */
  async createBranch(branchName, options = {}) {
    try {
      // Get the default branch SHA
      const defaultBranch = await this.getDefaultBranch();
      const ref = await this.request(`/repos/${this.owner}/${this.repo}/git/refs/heads/${defaultBranch.name}`);
      
      // Create new branch
      const newBranch = await this.request(`/repos/${this.owner}/${this.repo}/git/refs`, {
        method: "POST",
        body: {
          ref: `refs/heads/${branchName}`,
          sha: ref.object.sha,
        },
      });

      console.log(`Created agentic branch: ${branchName}`);
      return {
        name: branchName,
        sha: newBranch.object.sha,
        purpose: options.purpose || "agentic-workflow",
      };
    } catch (error) {
      console.error(`Failed to create branch ${branchName}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get the default branch of the repository
   */
  async getDefaultBranch() {
    const repo = await this.request(`/repos/${this.owner}/${this.repo}`);
    return {
      name: repo.default_branch,
      sha: repo.default_branch,
    };
  }

  /**
   * Create an issue for agentic workflow communication
   */
  async createIssue(title, body, labels = []) {
    try {
      const issue = await this.request(`/repos/${this.owner}/${this.repo}/issues`, {
        method: "POST",
        body: {
          title,
          body,
          labels: ["agentic", ...labels],
        },
      });

      console.log(`Created agentic issue #${issue.number}: ${title}`);
      return {
        number: issue.number,
        title: issue.title,
        body: issue.body,
        labels: issue.labels.map(label => label.name),
        url: issue.html_url,
      };
    } catch (error) {
      console.error(`Failed to create issue: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update an existing issue
   */
  async updateIssue(issueNumber, updates) {
    try {
      const issue = await this.request(`/repos/${this.owner}/${this.repo}/issues/${issueNumber}`, {
        method: "PATCH",
        body: updates,
      });

      console.log(`Updated agentic issue #${issue.number}`);
      return issue;
    } catch (error) {
      console.error(`Failed to update issue #${issueNumber}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Add a comment to an issue
   */
  async addComment(issueNumber, comment) {
    try {
      const response = await this.request(`/repos/${this.owner}/${this.repo}/issues/${issueNumber}/comments`, {
        method: "POST",
        body: {
          body: comment,
        },
      });

      console.log(`Added comment to issue #${issueNumber}`);
      return response;
    } catch (error) {
      console.error(`Failed to add comment to issue #${issueNumber}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get issues with agentic labels
   */
  async getAgenticIssues(state = "open") {
    try {
      const issues = await this.request(`/repos/${this.owner}/${this.repo}/issues?labels=agentic&state=${state}`);
      return issues.map(issue => ({
        number: issue.number,
        title: issue.title,
        body: issue.body,
        labels: issue.labels.map(label => label.name),
        state: issue.state,
        url: issue.html_url,
      }));
    } catch (error) {
      console.error(`Failed to get agentic issues: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get branches with agentic prefix
   */
  async getAgenticBranches() {
    try {
      const branches = await this.request(`/repos/${this.owner}/${this.repo}/branches`);
      return branches.filter(branch => 
        branch.name.includes("agentic") || 
        branch.name.includes("workflow") ||
        branch.name.includes("auto")
      );
    } catch (error) {
      console.error(`Failed to get agentic branches: ${error.message}`);
      throw error;
    }
  }
}