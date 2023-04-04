package <%= package.dot %>.event;

import com.monolith.mommos.event.CommandGateway;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.kafka.test.context.EmbeddedKafka;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
@EmbeddedKafka(topics = "<%= topicName.input %>", partitions = 1, brokerProperties = {"listeners=PLAINTEXT://localhost:9092", "port=9092"})
class <%= eventHandlerName.pascal %>Test {

    @Autowired
    private CommandGateway commandGateway;

    @Test
    void <%= cunsumeEventName.camel %>_Success_Test() throws Exception {
        // given
        Object eventForListening = Map.of("message", "Hello");

        // when
        commandGateway.builder()
                .event("<%= topicName.input %>", "<%= cunsumeEventName.camel %>", eventForListening)
                .send();

        // then
        try {
            Thread.sleep(3000); // 이벤트 처리를 위해 3초 대기
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        // Write Assertions..
        Assertions.assertNotNull(new Object());
    }
}