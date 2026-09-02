# Healthcare Integration Coding Lab

Interactive GitHub Pages training application for learning how Spring Boot / Java integration logic translates into Mule XML and DataWeave.

## Training sequence

1. Solve the requirement in Java.
2. Run the browser-based Java logic check.
3. Translate routing/orchestration into Mule XML or data transformation into DataWeave.
4. Check the Mule/DataWeave answer.
5. Compare both implementations and follow the runtime flow.

## Version 1 lessons

- Quantity rule: Java boolean → DataWeave expression
- Service-code validation: Java `if` → Mule `choice` / `raise-error`
- ORM order control: Java `switch` → Mule `choice`
- Java DTO construction → DataWeave XML mapping
- Spring `JmsTemplate` → Mule JMS publish
- Complete ORM New Order processing flow

## Important

This is a static GitHub Pages training simulator. It does not compile arbitrary Java or run a real Mule Runtime in the browser. The controls validate the training patterns and display simulated execution results.

Use synthetic healthcare data only.
