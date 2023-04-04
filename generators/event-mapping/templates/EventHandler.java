package <%= package.dot %>.event;

import com.monolith.mommos.event.annotation.EventHandler;
import com.monolith.mommos.event.annotation.EventMapping;
import lombok.RequiredArgsConstructor;

@EventHandler
@RequiredArgsConstructor
public class <%= eventHandlerName.pascal %> {

    @EventMapping(topic = "<%= topicName.input %>", listen = "<%= cunsumeEventName.camel %>", event = "<%= produceEventName.camel %>")
    public Object <%= cunsumeEventName.camel %>(Obejct topicValueAvro) {
        // Write logics here..

        return null;
    }
}
