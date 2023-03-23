package <%= package.dot %>;

import com.monolith.mommos.event.annotation.EventDispatcher;
import org.apache.avro.specific.SpecificRecord;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;

@EventDispatcher
public interface <%= eventDispacherName.pascal %> {

    @KafkaListener(topics = "<%= topicName.input %>")
    void listen<%= topicName.pascal %>(ConsumerRecord<String, SpecificRecord> consumerRecord);
}
