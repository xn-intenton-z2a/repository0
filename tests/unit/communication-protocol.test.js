import { describe, expect, it, vi, beforeEach } from "vitest";
import { CommunicationProtocol } from "../../src/lib/communication-protocol.js";

// Mock GitHub integration
const mockGitHub = {
  getAgenticIssues: vi.fn(),
  createIssue: vi.fn(),
  addComment: vi.fn(),
};

describe("CommunicationProtocol", () => {
  let protocol;

  beforeEach(() => {
    vi.clearAllMocks();
    protocol = new CommunicationProtocol(mockGitHub, {});
  });

  describe("initialize", () => {
    it("should create communication hub issue", async () => {
      mockGitHub.getAgenticIssues.mockResolvedValue([]);
      mockGitHub.createIssue.mockResolvedValue({
        number: 1,
        title: "Agentic Communication Hub",
      });

      await protocol.initialize();

      expect(mockGitHub.createIssue).toHaveBeenCalledWith(
        "Agentic Communication Hub",
        expect.stringContaining("central communication hub"),
        ["agentic", "communication", "hub"]
      );
      expect(protocol.hubIssue.number).toBe(1);
    });

    it("should use existing hub issue if found", async () => {
      const existingIssue = {
        number: 2,
        title: "Agentic Communication Hub",
      };
      mockGitHub.getAgenticIssues.mockResolvedValue([existingIssue]);

      await protocol.initialize();

      expect(mockGitHub.createIssue).not.toHaveBeenCalled();
      expect(protocol.hubIssue).toBe(existingIssue);
    });
  });

  describe("sendMessage", () => {
    beforeEach(async () => {
      mockGitHub.getAgenticIssues.mockResolvedValue([]);
      mockGitHub.createIssue.mockResolvedValue({ number: 1 });
      mockGitHub.addComment.mockResolvedValue({});
      await protocol.initialize();
    });

    it("should send message to default channel", async () => {
      const message = "Test message";
      const result = await protocol.sendMessage(message);

      expect(result.message).toBe(message);
      expect(result.channel).toBe("default");
      expect(result.id).toMatch(/^msg_\d+_[a-z0-9]+$/);
      expect(mockGitHub.addComment).toHaveBeenCalledWith(1, expect.stringContaining(message));
    });

    it("should send message to specific channel", async () => {
      const message = "Channel message";
      const channel = "test-channel";

      mockGitHub.createIssue.mockResolvedValueOnce({ number: 2 }); // Channel issue

      const result = await protocol.sendMessage(message, channel);

      expect(result.channel).toBe(channel);
      expect(mockGitHub.addComment).toHaveBeenCalledTimes(2); // Hub + channel
    });

    it("should include metadata in message", async () => {
      const options = {
        sender: "test-workflow",
        type: "status",
      };

      const result = await protocol.sendMessage("Status update", "default", options);

      expect(result.sender).toBe("test-workflow");
      expect(result.type).toBe("status");
      expect(result.timestamp).toBeDefined();
    });
  });

  describe("receiveMessages", () => {
    beforeEach(() => {
      // Add some test messages
      protocol.messageQueue.set("default", [
        {
          id: "msg1",
          message: "Message 1",
          timestamp: "2023-01-01T10:00:00Z",
          type: "info",
          sender: "workflow1",
        },
        {
          id: "msg2",
          message: "Message 2", 
          timestamp: "2023-01-01T11:00:00Z",
          type: "status",
          sender: "workflow2",
        },
      ]);
    });

    it("should return all messages from channel", async () => {
      const messages = await protocol.receiveMessages("default");

      expect(messages).toHaveLength(2);
      expect(messages[0].id).toBe("msg2"); // Most recent first
      expect(messages[1].id).toBe("msg1");
    });

    it("should filter messages by type", async () => {
      const messages = await protocol.receiveMessages("default", { type: "status" });

      expect(messages).toHaveLength(1);
      expect(messages[0].type).toBe("status");
    });

    it("should filter messages by sender", async () => {
      const messages = await protocol.receiveMessages("default", { sender: "workflow1" });

      expect(messages).toHaveLength(1);
      expect(messages[0].sender).toBe("workflow1");
    });

    it("should limit number of messages", async () => {
      const messages = await protocol.receiveMessages("default", { limit: 1 });

      expect(messages).toHaveLength(1);
      expect(messages[0].id).toBe("msg2"); // Most recent
    });

    it("should filter messages since timestamp", async () => {
      const since = "2023-01-01T10:30:00Z";
      const messages = await protocol.receiveMessages("default", { since });

      expect(messages).toHaveLength(1);
      expect(messages[0].id).toBe("msg2");
    });
  });

  describe("createChannel", () => {
    it("should create new channel issue", async () => {
      mockGitHub.createIssue.mockResolvedValue({
        number: 5,
        title: "Agentic Channel: test-channel",
      });

      const result = await protocol.createChannel("test-channel", "Test description");

      expect(mockGitHub.createIssue).toHaveBeenCalledWith(
        "Agentic Channel: test-channel",
        "Test description",
        ["agentic", "communication", "channel", "test-channel"]
      );
      expect(protocol.channels.has("test-channel")).toBe(true);
      expect(protocol.messageQueue.has("test-channel")).toBe(true);
    });

    it("should return existing channel if already exists", async () => {
      const existingChannel = { number: 3 };
      protocol.channels.set("existing-channel", existingChannel);

      const result = await protocol.createChannel("existing-channel");

      expect(result).toBe(existingChannel);
      expect(mockGitHub.createIssue).not.toHaveBeenCalled();
    });
  });

  describe("utility methods", () => {
    it("should send status updates", async () => {
      mockGitHub.getAgenticIssues.mockResolvedValue([]);
      mockGitHub.createIssue.mockResolvedValue({ number: 1 });
      mockGitHub.addComment.mockResolvedValue({});
      await protocol.initialize();

      await protocol.sendStatus("wf123", "running", { progress: 50 });

      expect(mockGitHub.addComment).toHaveBeenCalledWith(
        1,
        expect.stringContaining("wf123")
      );
    });

    it("should send error notifications", async () => {
      mockGitHub.getAgenticIssues.mockResolvedValue([]);
      mockGitHub.createIssue.mockResolvedValue({ number: 1 });
      mockGitHub.addComment.mockResolvedValue({});
      await protocol.initialize();

      const error = new Error("Test error");
      await protocol.sendError("wf123", error, { context: "test" });

      expect(mockGitHub.addComment).toHaveBeenCalledWith(
        1,
        expect.stringContaining("Test error")
      );
    });

    it("should format messages correctly", () => {
      const messageData = {
        id: "msg123",
        channel: "test",
        message: "Hello world",
        timestamp: "2023-01-01T12:00:00Z",
        sender: "workflow1",
        type: "info",
      };

      const formatted = protocol.formatMessage(messageData);

      expect(formatted).toContain("msg123");
      expect(formatted).toContain("Hello world");
      expect(formatted).toContain("ℹ️"); // Info emoji
    });

    it("should get correct type emojis", () => {
      expect(protocol.getTypeEmoji("info")).toBe("ℹ️");
      expect(protocol.getTypeEmoji("error")).toBe("❌");
      expect(protocol.getTypeEmoji("success")).toBe("✅");
      expect(protocol.getTypeEmoji("unknown")).toBe("💬");
    });

    it("should generate unique message IDs", () => {
      const id1 = protocol.generateMessageId();
      const id2 = protocol.generateMessageId();

      expect(id1).toMatch(/^msg_\d+_[a-z0-9]+$/);
      expect(id2).toMatch(/^msg_\d+_[a-z0-9]+$/);
      expect(id1).not.toBe(id2);
    });
  });

  describe("channel statistics", () => {
    beforeEach(() => {
      const now = new Date();
      const anHourAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
      const thirtyMinAgo = new Date(now.getTime() - 30 * 60 * 1000);

      protocol.messageQueue.set("stats-test", [
        { timestamp: anHourAgo.toISOString() },
        { timestamp: thirtyMinAgo.toISOString() },
        { timestamp: now.toISOString() },
      ]);
    });

    it("should calculate channel statistics", () => {
      const stats = protocol.getChannelStats("stats-test");

      expect(stats.totalMessages).toBe(3);
      expect(stats.recentMessages).toBe(2); // Within last hour
      expect(stats.lastMessage).toBeDefined();
    });

    it("should handle empty channels", () => {
      const stats = protocol.getChannelStats("empty-channel");

      expect(stats.totalMessages).toBe(0);
      expect(stats.recentMessages).toBe(0);
      expect(stats.lastMessage).toBeNull();
    });
  });
});