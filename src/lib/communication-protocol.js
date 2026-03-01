// src/lib/communication-protocol.js

/**
 * Communication Protocol
 * 
 * Implements the communication protocol for agentic workflows to exchange
 * information through branches and issues, enabling autonomous coordination
 * between different workflow instances.
 */
export class CommunicationProtocol {
  constructor(githubIntegration, options = {}) {
    this.github = githubIntegration;
    this.options = options;
    this.channels = new Map();
    this.messageQueue = new Map();
  }

  /**
   * Initialize the communication system
   */
  async initialize() {
    console.log("Initializing agentic communication protocol...");
    
    // Create main communication issue if it doesn't exist
    const existingIssues = await this.github.getAgenticIssues();
    const commIssue = existingIssues.find(issue => 
      issue.title.includes("Agentic Communication Hub")
    );

    if (!commIssue) {
      this.hubIssue = await this.github.createIssue(
        "Agentic Communication Hub",
        this.generateHubDescription(),
        ["agentic", "communication", "hub"]
      );
    } else {
      this.hubIssue = commIssue;
    }

    console.log(`Communication hub initialized: Issue #${this.hubIssue.number}`);
  }

  /**
   * Send a message through the agentic communication system
   */
  async sendMessage(message, channel = "default", options = {}) {
    const messageId = this.generateMessageId();
    const timestamp = new Date().toISOString();
    
    const messageData = {
      id: messageId,
      channel,
      message,
      timestamp,
      sender: options.sender || "agentic-workflow",
      type: options.type || "info",
      ...options,
    };

    try {
      // Store message in appropriate channel
      if (!this.messageQueue.has(channel)) {
        this.messageQueue.set(channel, []);
      }
      this.messageQueue.get(channel).push(messageData);

      // Post message to communication hub issue
      const comment = this.formatMessage(messageData);
      await this.github.addComment(this.hubIssue.number, comment);

      // If this is a channel-specific message, also create/update channel issue
      if (channel !== "default") {
        await this.ensureChannelIssue(channel);
        const channelIssue = this.channels.get(channel);
        if (channelIssue) {
          await this.github.addComment(channelIssue.number, comment);
        }
      }

      console.log(`Sent agentic message ${messageId} to channel '${channel}'`);
      return messageData;
    } catch (error) {
      console.error(`Failed to send message: ${error.message}`);
      throw error;
    }
  }

  /**
   * Receive messages from a specific channel
   */
  async receiveMessages(channel = "default", options = {}) {
    try {
      const channelMessages = this.messageQueue.get(channel) || [];
      
      // Apply filters if specified
      let messages = [...channelMessages];
      
      if (options.since) {
        const since = new Date(options.since);
        messages = messages.filter(msg => new Date(msg.timestamp) > since);
      }

      if (options.type) {
        messages = messages.filter(msg => msg.type === options.type);
      }

      if (options.sender) {
        messages = messages.filter(msg => msg.sender === options.sender);
      }

      // Return most recent first
      messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      if (options.limit) {
        messages = messages.slice(0, options.limit);
      }

      return messages;
    } catch (error) {
      console.error(`Failed to receive messages from channel '${channel}': ${error.message}`);
      throw error;
    }
  }

  /**
   * Create a new communication channel
   */
  async createChannel(channelName, description = "") {
    if (this.channels.has(channelName)) {
      return this.channels.get(channelName);
    }

    try {
      const channelIssue = await this.github.createIssue(
        `Agentic Channel: ${channelName}`,
        description || `Communication channel for agentic workflows: ${channelName}`,
        ["agentic", "communication", "channel", channelName]
      );

      this.channels.set(channelName, channelIssue);
      this.messageQueue.set(channelName, []);

      console.log(`Created agentic communication channel: ${channelName}`);
      return channelIssue;
    } catch (error) {
      console.error(`Failed to create channel ${channelName}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Ensure a channel issue exists
   */
  async ensureChannelIssue(channelName) {
    if (!this.channels.has(channelName)) {
      await this.createChannel(channelName);
    }
  }

  /**
   * Send a status update
   */
  async sendStatus(workflowId, status, details = {}) {
    return await this.sendMessage({
      workflowId,
      status,
      details,
    }, "status", {
      type: "status",
      sender: `workflow-${workflowId}`,
    });
  }

  /**
   * Send an error notification
   */
  async sendError(workflowId, error, context = {}) {
    return await this.sendMessage({
      workflowId,
      error: error.message || error,
      context,
    }, "errors", {
      type: "error",
      sender: `workflow-${workflowId}`,
    });
  }

  /**
   * Send a coordination request
   */
  async sendCoordinationRequest(fromWorkflow, toWorkflow, request) {
    return await this.sendMessage({
      from: fromWorkflow,
      to: toWorkflow,
      request,
    }, "coordination", {
      type: "coordination",
      sender: `workflow-${fromWorkflow}`,
    });
  }

  /**
   * Get all available channels
   */
  getChannels() {
    return Array.from(this.channels.keys());
  }

  /**
   * Get channel statistics
   */
  getChannelStats(channelName) {
    const messages = this.messageQueue.get(channelName) || [];
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const recentMessages = messages.filter(msg => new Date(msg.timestamp) > oneHourAgo);

    return {
      totalMessages: messages.length,
      recentMessages: recentMessages.length,
      lastMessage: messages.length > 0 ? messages[messages.length - 1].timestamp : null,
    };
  }

  /**
   * Format message for GitHub comments
   */
  formatMessage(messageData) {
    const { id, channel, message, timestamp, sender, type } = messageData;
    const typeEmoji = this.getTypeEmoji(type);
    
    return `
${typeEmoji} **Agentic Message** \`${id}\`
**Channel:** ${channel} | **Sender:** ${sender} | **Time:** ${timestamp}

${typeof message === "string" ? message : "```json\n" + JSON.stringify(message, null, 2) + "\n```"}
    `.trim();
  }

  /**
   * Get emoji for message type
   */
  getTypeEmoji(type) {
    const emojis = {
      info: "ℹ️",
      status: "📊",
      error: "❌",
      warning: "⚠️",
      success: "✅",
      coordination: "🤝",
      default: "💬",
    };
    return emojis[type] || emojis.default;
  }

  /**
   * Generate hub description
   */
  generateHubDescription() {
    return `
# Agentic Communication Hub

This issue serves as the central communication hub for agentic workflows in this repository.

**Purpose:** Enable autonomous workflows to communicate, coordinate, and share status updates through a structured protocol.

**Usage:**
- Workflows post messages as comments
- Status updates are automatically tracked
- Error notifications are centralized
- Coordination between workflows is facilitated

**Created:** ${new Date().toISOString()}
    `.trim();
  }

  /**
   * Generate unique message ID
   */
  generateMessageId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  }
}