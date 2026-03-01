import { describe, expect, it, vi, beforeEach, test } from "vitest";
import { main, AgenticLib } from "../../src/lib/main.js";

// Mock environment variables
vi.mock("process", () => ({
  env: {
    GITHUB_TOKEN: "test-token",
    GITHUB_REPOSITORY: "test-owner/test-repo",
  },
  argv: ["node", "main.js", "test", "args"],
}));

// Mock fetch for GitHub API calls
global.fetch = vi.fn();

describe("Main Output", () => {
  test("should terminate without error", () => {
    process.argv = ["node", "src/lib/main.js"];
    main();
  });
});

describe("main", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize AgenticLib and return it", () => {
    const args = ["arg1", "arg2"];
    const result = main(args);
    
    expect(result).toBeInstanceOf(AgenticLib);
  });

  it("should log initialization message", () => {
    const consoleSpy = vi.spyOn(console, "log");
    const args = ["test"];
    
    main(args);
    
    expect(consoleSpy).toHaveBeenCalledWith("Agentic-lib initialized");
    expect(consoleSpy).toHaveBeenCalledWith('Run with: ["test"]');
  });
});

describe("AgenticLib", () => {
  let agentic;

  beforeEach(() => {
    vi.clearAllMocks();
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });
    
    agentic = new AgenticLib({
      githubToken: "test-token",
      owner: "test-owner",
      repository: "test-repo",
    });
  });

  it("should initialize with correct options", () => {
    expect(agentic.options.githubToken).toBe("test-token");
    expect(agentic.options.owner).toBe("test-owner");
    expect(agentic.options.repository).toBe("test-repo");
  });

  it("should detect repository from environment", () => {
    // Mock the process.env for this test
    vi.stubEnv("GITHUB_REPOSITORY", "test-owner/test-repo");
    
    const lib = new AgenticLib();
    expect(lib.detectRepository()).toBe("test-repo");
    expect(lib.detectOwner()).toBe("test-owner");
    
    vi.unstubAllEnvs();
  });

  it("should have github, orchestrator, and communication components", () => {
    expect(agentic.github).toBeDefined();
    expect(agentic.orchestrator).toBeDefined();
    expect(agentic.communication).toBeDefined();
  });

  it("should initialize communication channels", async () => {
    const initSpy = vi.spyOn(agentic.communication, "initialize");
    initSpy.mockResolvedValue();
    
    await agentic.initialize();
    
    expect(initSpy).toHaveBeenCalled();
  });
});
