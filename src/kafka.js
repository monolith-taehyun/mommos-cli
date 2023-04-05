const { Kafka, logLevel } = require('kafkajs');

class KafkaClient {
	constructor(options) {
		this.kafka = new Kafka({ ...options, logLevel: logLevel.INFO });
		this.admin = this.kafka.admin();
	}

	async createTopic(topicName) {
		try {
			await this.admin.connect();
			const result = await this.admin.createTopics({
				topics: [
					{
						topic: topicName,
						numPartitions: 1,
					},
				],
			});
			console.log(`Topic [${topicName}] created successfully.`);
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
			console.log(`Topic [${topicName}] deleted successfully.`);
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

module.exports = KafkaClient;
