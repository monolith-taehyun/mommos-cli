const { Kafka, logLevel } = require('kafkajs');

class KafkaClient {
	constructor() {
		this.kafka = new Kafka({
			clientId: 'mommos-cli',
			brokers: ['pkc-e82om.ap-northeast-2.aws.confluent.cloud:9092'], // Kafka broker 정보,
			ssl: true,
			sasl: {
				mechanism: 'plain',
				username: 'EOAWADWPIZ555SER',
				password: '8QAwcYFTxCjAvFt1DX8piCexA/Z080Ok0HvNTLp0Ht5uGFbFhIZdIobCL1fBKcJ9',
			},
			clusterId: 'lkc-yonmxp',
			logLevel: logLevel.DEBUG,
		});
		this.admin = this.kafka.admin();
	}

	async createTopic(topicName) {
		try {
			await this.admin.connect();
			const result = await this.admin.createTopics({
				topics: [
					{
						topic: topicName,
					},
				],
				// validateOnly: true,
			});
			console.log(`Topic ${topicName} created successfully.`, result);
		} catch (error) {
			console.error(`Error creating topic ${topicName}`, error);
		} finally {
			await this.admin.disconnect();
		}
	}

	async deleteTopic(topicName) {
		try {
			await this.admin.connect();
			await this.admin.deleteTopics({
				topics: [topicName],
			});
			console.log(`Topic ${topicName} deleted successfully.`);
		} catch (error) {
			console.error(`Error deleting topic ${topicName}: ${error}`);
		} finally {
			await this.admin.disconnect();
		}
	}

	async listTopics() {
		try {
			await this.admin.connect();
			const topicList = await this.admin.listTopics();
			console.log(topicList);
		} catch (error) {
			console.error(`Error listing topics`, error);
		} finally {
			await this.admin.disconnect();
		}
	}

	async disconnect() {
		await this.admin.disconnect();
	}
}

module.exports = new KafkaClient();
