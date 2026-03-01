import { describe, expect, it, vi, beforeEach } from "vitest";
import { GitHubIntegration } from "../../src/lib/github-integration.js";

// Mock fetch globally
global.fetch = vi.fn();

describe("GitHubIntegration", () => {
  let github;

  beforeEach(() => {
    vi.clearAllMocks();
    github = new GitHubIntegration({
      githubToken: "test-token",
      owner: "test-owner",
      repository: "test-repo",
    });
  });

  describe("constructor", () => {
    it("should initialize with correct options", () => {
      expect(github.token).toBe("test-token");
      expect(github.owner).toBe("test-owner");
      expect(github.repo).toBe("test-repo");
      expect(github.baseURL).toBe("https://api.github.com");
    });

    it("should warn when no token provided", () => {
      const consoleSpy = vi.spyOn(console, "warn");
      new GitHubIntegration({ owner: "test", repository: "test" });
      
      expect(consoleSpy).toHaveBeenCalledWith("GitHub token not provided. Some functionality may be limited.");
    });
  });

  describe("request", () => {
    it("should make authenticated GET request", async () => {
      const mockResponse = { data: "test" };
      fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await github.request("/test");

      expect(fetch).toHaveBeenCalledWith("https://api.github.com/test", {
        method: "GET",
        headers: {
          "Accept": "application/vnd.github.v3+json",
          "User-Agent": "agentic-lib/1.0.0",
          "Authorization": "token test-token",
        },
      });
      expect(result).toEqual(mockResponse);
    });

    it("should make POST request with body", async () => {
      const mockResponse = { created: true };
      fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const body = { title: "Test" };
      await github.request("/test", {
        method: "POST",
        body,
      });

      expect(fetch).toHaveBeenCalledWith("https://api.github.com/test", {
        method: "POST",
        headers: {
          "Accept": "application/vnd.github.v3+json",
          "User-Agent": "agentic-lib/1.0.0",
          "Authorization": "token test-token",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
    });

    it("should handle API errors", async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 404,
        text: () => Promise.resolve("Not Found"),
      });

      await expect(github.request("/test")).rejects.toThrow("GitHub API error: 404 Not Found");
    });
  });

  describe("createBranch", () => {
    it("should create a new branch", async () => {
      // Mock getDefaultBranch
      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ default_branch: "main" }),
        })
        // Mock get ref
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ object: { sha: "abc123" } }),
        })
        // Mock create ref
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ object: { sha: "def456" } }),
        });

      const result = await github.createBranch("test-branch");

      expect(result).toEqual({
        name: "test-branch",
        sha: "def456",
        purpose: "agentic-workflow",
      });
    });
  });

  describe("createIssue", () => {
    it("should create an issue with agentic labels", async () => {
      const mockIssue = {
        number: 1,
        title: "Test Issue",
        body: "Test body",
        labels: [{ name: "agentic" }, { name: "test" }],
        html_url: "https://github.com/test/test/issues/1",
      };

      fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockIssue),
      });

      const result = await github.createIssue("Test Issue", "Test body", ["test"]);

      expect(result).toEqual({
        number: 1,
        title: "Test Issue",
        body: "Test body",
        labels: ["agentic", "test"],
        url: "https://github.com/test/test/issues/1",
      });

      expect(fetch).toHaveBeenCalledWith("https://api.github.com/repos/test-owner/test-repo/issues", {
        method: "POST",
        headers: {
          "Accept": "application/vnd.github.v3+json",
          "User-Agent": "agentic-lib/1.0.0",
          "Authorization": "token test-token",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Test Issue",
          body: "Test body",
          labels: ["agentic", "test"],
        }),
      });
    });
  });

  describe("getAgenticIssues", () => {
    it("should filter issues with agentic labels", async () => {
      const mockIssues = [
        {
          number: 1,
          title: "Agentic Issue",
          body: "Test",
          labels: [{ name: "agentic" }],
          state: "open",
          html_url: "https://github.com/test/test/issues/1",
        },
      ];

      fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockIssues),
      });

      const result = await github.getAgenticIssues();

      expect(result).toEqual([{
        number: 1,
        title: "Agentic Issue",
        body: "Test",
        labels: ["agentic"],
        state: "open",
        url: "https://github.com/test/test/issues/1",
      }]);
    });
  });
});