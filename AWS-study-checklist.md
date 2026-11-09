# My AWS Developer Associate study checklist

> One step at a time. Rest is part of the plan. Missing a day does not create double homework.

**Target:** AWS Certified Developer – Associate (DVA-C02)  
**Plan:** 16 flexible weeks, about 3.5–4 hours per week  
**Current position:** Week 6 GSI consistency lesson completed. Correctly identified that an immediate empty GSI result does not prove write failure and selected base-table GetItem with ConsistentRead: true using the full key for a strongly consistent read. Next: GSI versus LSI. Week 5 independent local execution and Week 3 idempotency-ID review remain pending. Continue without AWS access; current tutoring language is Vietnamese.  
**Start date:** __________  
**Preferred programming language / experience:** __________  
**Daily study time:** 45 minutes proposed; adjust as needed  
**Target exam month:** Not booked — decide after a readiness review

## How to use this checklist

Change `- [ ]` to `- [x]` when a task is finished, or ask the teacher to update this file after a lesson. Checkbox clicking depends on the editor you use.

A checked lesson means we covered it, not that you must remember it perfectly. Revisit uncertain topics. The week numbers describe an order, not deadlines. This roadmap organizes study; use the official exam guide to check complete objective coverage.

## Progress already made

These items reflect the conversation, not a formal assessment.

- [x] Match GetObject to reading and PutObject to writing.
- [x] Scope permissions to originals/ and thumbnails/ prefixes.
- [x] Explain why separate policy statements prevent unnecessary access.
- [x] Recognize that explicit deny overrides an allow.
- [x] Explain why credentials in code or environment variables can leak.
- [ ] Recheck implicit deny versus explicit deny without hints.
- [x] Recheck execution role versus Lambda resource policy: correctly distinguished API Gateway invocation from running-code S3 access on 2026-10-10.
- [ ] Apply these ideas in a practical exercise.

**Next session:** Week 6: compare GSI and LSI, focusing on partition keys and supported read consistency. Continue in Vietnamese.

## Roadmap at a glance

**Overall roadmap progress: 32%**

Percentages are estimates of topic coverage. A week reaches 100% only after its learning goal, practice goal, review, and summary are complete.

| Week | Topic | Progress | Status |
|---|---|---:|---|
| 1 | AWS foundations | 100% | Completed on 2026-09-08 |
| 2 | IAM and S3 permissions | 100% | Completed on 2026-09-09 |
| 3 | Lambda and AWS SDKs | 85% | Local logging and permission reviews complete; stable-versus-random retry-ID review deferred |
| 4 | API Gateway | 100% | Adapted introductory lessons, local simulation, and review completed on 2026-10-10; no AWS deployment |
| 5 | DynamoDB basics | 95% | Explanations, guided practice, review, and summary complete; independent local execution unconfirmed; ready to begin Week 6 |
| 6 | DynamoDB and data patterns | 20% | GSI eventual consistency and strongly consistent base-table reads correctly understood; GSI versus LSI next |
| 7 | Messaging | 0% | Not started |
| 8 | Retries and workflows | 0% | Not started |
| 9 | Application identity | 0% | Not started |
| 10 | Secrets and encryption | 10% | Brief preview only; independent recheck and practice pending |
| 11 | Infrastructure as code | 0% | Not started |
| 12 | CI/CD and releases | 0% | Not started |
| 13 | Monitoring and debugging | 0% | Not started |
| 14 | Performance and integration | 0% | Not started |
| 15 | Mixed practice and gap repair | 0% | Not started |
| 16 | Readiness review | 0% | Not started |

## Weekly rhythm

| Day | Time | Purpose |
|---|---:|---|
| Monday | 45 min | One concept and a worked example |
| Tuesday | 45 min | Guided exercise or a small lab |
| Wednesday | Rest | No study required |
| Thursday | 45 min | One concept and a few questions |
| Friday | 45 min | Apply and practice |
| Saturday | 30 min | Weekly summary and gentle review |
| Sunday | Rest | No study required |

**Daily stopping point:** 5 minutes recall + 15 minutes explanation + 15 minutes application + 10 minutes summary = 45 minutes, then stop.  
**Tired-day option:** 15 minutes of review only, or rest.  
**Labs:** Learner preference (2026-10-05): use explanations, walkthroughs, and local exercises without an AWS account or paid resources. Replace AWS deployment labs with clearly labeled local simulations or walkthroughs; do not claim real AWS hands-on experience. Revisit AWS access only if the learner requests it.  
**Mock exams:** A full timed simulation needs a separate longer slot; replace normal study time rather than adding it on top.

## Week-by-week checklist

### Week 1 — AWS foundations

**Learning goal:** Explain accounts, Regions, Availability Zones, and the roles of S3 and Lambda.  
**Practice goal:** Draw the photo → S3 → Lambda → thumbnail flow.

- [ ] Monday: concept and worked example.
- [ ] Tuesday: guided practice.
- [ ] Wednesday: rest.
- [ ] Thursday: next concept and short questions.
- [ ] Friday: apply this week's ideas.
- [ ] Saturday: review and write the weekly summary.
- [ ] Sunday: rest.
- [x] Explain the learning goal in my own words.
- [x] Complete the practice goal, or record exactly where I need help.
- [x] Agree on the next step with the teacher.

**What I understand:**  
- Separate development and production accounts reduce the impact of mistakes.
- A nearby Region can reduce latency; Region choice also depends on services, price, and legal requirements.
- Multiple AZs protect against an AZ failure. S3 buckets and ordinary Lambda functions are Regional resources rather than resources placed in one AZ.

**What needs review:**  
- Revisit cross-account permissions when we study IAM in Week 2.
- Later compare multi-AZ and multi-Region designs in more detail.

**Next step:**  
Begin Week 2 with execution roles, resource policies, and a short independent recheck.

**Week finished on:** 2026-09-08

### Week 2 — IAM and S3 permissions

**Learning goal:** Explain execution roles, resource policies, least privilege, and explicit deny.  
**Practice goal:** Write separate policies for reading originals and writing thumbnails.

- [ ] Monday: concept and worked example.
- [ ] Tuesday: guided practice.
- [ ] Wednesday: rest.
- [ ] Thursday: next concept and short questions.
- [ ] Friday: apply this week's ideas.
- [ ] Saturday: review and write the weekly summary.
- [ ] Sunday: rest.
- [x] Explain the learning goal in my own words.
- [x] Complete the practice goal, or record exactly where I need help.
- [x] Agree on the next step with the teacher.

**What I understand:**  
- A Lambda execution role controls AWS API calls made by the running function; a Lambda resource policy controls who or what may invoke the function.
- IAM begins with implicit deny, a matching allow can grant access, and any applicable explicit deny wins.
- ListBucket uses the bucket ARN, while GetObject and PutObject use object ARNs. Prefix conditions can restrict listing.

**What needs review:**  
- Revisit cross-account S3 permission requirements in a later security lesson.
- Continue applying action, resource, and condition matching in unfamiliar exam scenarios.

**Next step:**  
Begin Week 3 with Lambda handlers, events, and temporary credentials.

**Week finished on:** 2026-09-09
### Week 3 — Lambda and AWS SDKs

**Learning goal:** Explain handlers, events, temporary credentials, timeouts, and concurrency.  
**Practice goal:** Run a small function and inspect its logs.

**Progress updated:** 2026-10-05 — 85% topic coverage. Learner completed the local exercise and correctly identified both results. Overall roadmap progress rounds to 18%.

**Lesson checkpoints:**

- [x] Trace an S3 event to the bucket and object key used by a handler.
- [x] Explain temporary execution-role credentials and why copied credentials expire.
- [x] Cover timeouts, retries, and stable business IDs for idempotency.
- [x] Recheck concurrency counting and direct synchronous throttling.
- [x] Predict the log messages for empty and valid order events.
- [x] Teacher demonstrated both events locally using Node.js.
- [x] Identify that an uncaught throw fails the invocation after explanation.
- [x] Correctly identify a successful invocation returning { success: false } (2026-10-05).
- [x] Independently identify the execution role as the attachment point for AWSLambdaBasicExecutionRole: StudyLambdaRole (2026-10-05).
- [x] Run the local exercise myself and inspect its output (2026-10-05): empty event ERROR Invalid event; valid event SUCCESS.
- [x] Cover the CloudWatch logging flow through a teacher walkthrough and correctly identify that logging permissions are required (2026-10-05).
- [ ] Optional future practice: run the function in AWS and inspect CloudWatch Logs; deferred by learner preference, not required to finish the adapted Week 3 lesson.
- [x] Complete a short Week 3 review and summary (2026-10-05): duplicate stable-ID write correctly identified as rejected after explanation.
- [ ] Independently recheck why new random IDs on retries do not prevent duplicate orders before closing Week 3.

**Local exercise:** [Handler](week-03/logging-lab/handler.mjs) and [runner](week-03/logging-lab/run-lab.mjs). From D:\working\LearnAWS, run `node .\week-03\logging-lab\run-lab.mjs`. The teacher's demonstration made no AWS calls and did not validate IAM permissions or CloudWatch delivery.

- [ ] Monday: concept and worked example.
- [ ] Tuesday: guided practice.
- [ ] Wednesday: rest.
- [ ] Thursday: next concept and short questions.
- [ ] Friday: apply this week's ideas.
- [ ] Saturday: review and write the weekly summary.
- [ ] Sunday: rest.
- [ ] Explain the learning goal in my own words.
- [ ] Complete the practice goal, or record exactly where I need help.
- [ ] Agree on the next step with the teacher.

**What I understand:**  
- Events supply input, while the execution role supplies permissions and temporary credentials for AWS API calls.
- Concurrency counts running invocations; a direct synchronous request is throttled when no concurrency is available.
- I correctly traced both logging paths and identified that an uncaught throw fails the invocation.

**What needs review:**  
- Returning { success: false } ends normally; that application data does not itself mark the Lambda invocation as failed. console.error writes a message without itself failing the invocation.
- AWSLambdaBasicExecutionRole is a policy attached to the execution role. Independently recheck this distinction, then practice log inspection.

**Next step:**  
One brief return-versus-throw recheck and one policy-attachment recheck, then resume practical logging. Stop after the agreed small lesson and save a summary.

**Week finished on:** __________
### Week 4 — API Gateway

**Learning goal:** Explain HTTP requests, API integrations, validation, and stages.  
**Practice goal (adapted to learner preference):** Trace API Gateway-to-Lambda request/response flow and run the local proxy-handler simulation. No AWS account or endpoint deployment required.

**Completion summary (2026-10-10):** GET/POST, path/query/body fields, JSON.parse and JSON.stringify, explicit 201/400 responses, input validation, stages/deployments, and invocation permissions covered. Learner ran all five local cases and correctly answered the final two review questions. This completes this week's introductory scope, not every API Gateway exam topic.

- [ ] Monday: concept and worked example.
- [ ] Tuesday: guided practice.
- [ ] Wednesday: rest.
- [ ] Thursday: next concept and short questions.
- [ ] Friday: apply this week's ideas.
- [ ] Saturday: review and write the weekly summary.
- [ ] Sunday: rest.
- [ ] Explain the learning goal in my own words.
- [ ] Complete the practice goal, or record exactly where I need help.
- [ ] Agree on the next step with the teacher.

**What I understand:**  
- API Gateway routes HTTP requests to Lambda and sends the response to the client; Lambda runs application logic.
- Parse JSON request text before validating fields. A normal return with HTTP 400 is still a successful Lambda invocation.
- With automatic deployment disabled, a stage continues serving its assigned deployment until a new deployment is created and assigned.
- Lambda resource-based policy authorizes API Gateway invocation; execution-role permissions authorize AWS calls from running code.

**What needs review:**  
- Later security, monitoring, and performance lessons will revisit authorization, throttling, CORS, and HTTP API versus REST API differences.
- Local simulation was completed; real API Gateway deployment and service behavior were not tested.

**Next step:**  
Begin Week 5: DynamoDB tables, items, and partition keys using order records. Calendar-day boxes remain unchecked because study duration and rest activity were not recorded.

**Week finished on:** 2026-10-10 (adapted local/walkthrough scope)
### Week 5 — DynamoDB basics

**Learning goal:** Choose partition/sort keys and distinguish Query from Scan.  
**Practice goal:** Save and retrieve application records.

**Progress checkpoint (2026-10-23):** Guided walkthrough and mixed review covered. Teacher verified local scripts; learner execution remains unconfirmed.
- [x] Compare GetItem, Query, and Scan.
- [x] Trace conditional creation, selected-attribute updates, and pagination.
- [x] Complete a short mixed review: Query chosen correctly and bookmark passed to ExclusiveStartKey.
- [x] Recheck same-full-key PutItem replacement with a fresh Products example: omitted category correctly identified; teacher reinforced one item remains.
- [ ] Run local item-operation practice independently, or explicitly choose walkthrough-only practice and record that limitation.
- [x] Save the final Week 5 summary before moving to Week 6 (2026-10-23).

- [ ] Monday: concept and worked example.
- [ ] Tuesday: guided practice.
- [ ] Wednesday: rest.
- [ ] Thursday: next concept and short questions.
- [ ] Friday: apply this week's ideas.
- [ ] Saturday: review and write the weekly summary.
- [ ] Sunday: rest.
- [ ] Explain the learning goal in my own words.
- [ ] Complete the practice goal, or record exactly where I need help.
- [ ] Agree on the next step with the teacher.

**What I understand:**  
- The full primary key identifies an item; GetItem needs all key attributes. Query uses partition-key equality, while a full Scan reads across the table before filtering.
- Same-key PutItem replaces the whole item; UpdateItem changes selected attributes. Conditions can guard creation and updates.
- Use LastEvaluatedKey as the next ExclusiveStartKey; an empty filtered Items page is not a stopping signal.

**What needs review:**  
- Independent execution of the local item-operation and pagination scripts remains unconfirmed; only teacher-run demonstrations and learner interpretation are recorded.
- Reinforce exact key names and values in code, and revisit pagination with unfamiliar examples later.

**Next step:**  
Begin Week 6 secondary indexes without AWS access. Keep the independent local practice gap recorded rather than blocking conceptual learning.

**Week finished on:** Explanations, guided review, and summary finished 2026-10-23; independent local practice pending (95%).
### Week 6 — DynamoDB and data patterns

**Learning goal:** Explain indexes, consistency, conditional writes, and caching tradeoffs.  
**Practice goal:** Prevent a duplicate record with a conditional write.

- [ ] Monday: concept and worked example.
- [ ] Tuesday: guided practice.
- [ ] Wednesday: rest.
- [ ] Thursday: next concept and short questions.
- [ ] Friday: apply this week's ideas.
- [ ] Saturday: review and write the weekly summary.
- [ ] Sunday: rest.
- [ ] Explain the learning goal in my own words.
- [ ] Complete the practice goal, or record exactly where I need help.
- [ ] Agree on the next step with the teacher.

**What I understand:**  
_Write 2–3 short points._

**What needs review:**  
_Write one or two questions; uncertainty is normal._

**Next step:**  
__________

**Week finished on:** __________
### Week 7 — Messaging

**Learning goal:** Compare SQS, SNS, and EventBridge using example requirements.  
**Practice goal:** Trace an event from producer to consumer.

- [ ] Monday: concept and worked example.
- [ ] Tuesday: guided practice.
- [ ] Wednesday: rest.
- [ ] Thursday: next concept and short questions.
- [ ] Friday: apply this week's ideas.
- [ ] Saturday: review and write the weekly summary.
- [ ] Sunday: rest.
- [ ] Explain the learning goal in my own words.
- [ ] Complete the practice goal, or record exactly where I need help.
- [ ] Agree on the next step with the teacher.

**What I understand:**  
_Write 2–3 short points._

**What needs review:**  
_Write one or two questions; uncertainty is normal._

**Next step:**  
__________

**Week finished on:** __________
### Week 8 — Retries and workflows

**Learning goal:** Explain idempotency, dead-letter queues, partial batch failures, and orchestration.  
**Practice goal:** Diagnose a repeated message and design safe recovery.

- [ ] Monday: concept and worked example.
- [ ] Tuesday: guided practice.
- [ ] Wednesday: rest.
- [ ] Thursday: next concept and short questions.
- [ ] Friday: apply this week's ideas.
- [ ] Saturday: review and write the weekly summary.
- [ ] Sunday: rest.
- [ ] Explain the learning goal in my own words.
- [ ] Complete the practice goal, or record exactly where I need help.
- [ ] Agree on the next step with the teacher.

**What I understand:**  
_Write 2–3 short points._

**What needs review:**  
_Write one or two questions; uncertainty is normal._

**Next step:**  
__________

**Week finished on:** __________
### Week 9 — Application identity

**Learning goal:** Distinguish authentication, authorization, Cognito pools, and role assumption.  
**Practice goal:** Choose identity and permissions for a small application.

- [ ] Monday: concept and worked example.
- [ ] Tuesday: guided practice.
- [ ] Wednesday: rest.
- [ ] Thursday: next concept and short questions.
- [ ] Friday: apply this week's ideas.
- [ ] Saturday: review and write the weekly summary.
- [ ] Sunday: rest.
- [ ] Explain the learning goal in my own words.
- [ ] Complete the practice goal, or record exactly where I need help.
- [ ] Agree on the next step with the teacher.

**What I understand:**  
_Write 2–3 short points._

**What needs review:**  
_Write one or two questions; uncertainty is normal._

**Next step:**  
__________

**Week finished on:** __________
### Week 10 — Secrets and encryption

**Learning goal:** Explain Secrets Manager, Parameter Store, KMS, and encryption boundaries.  
**Practice goal:** Design secure retrieval of an external API token.

- [ ] Monday: concept and worked example.
- [ ] Tuesday: guided practice.
- [ ] Wednesday: rest.
- [ ] Thursday: next concept and short questions.
- [ ] Friday: apply this week's ideas.
- [ ] Saturday: review and write the weekly summary.
- [ ] Sunday: rest.
- [ ] Explain the learning goal in my own words.
- [ ] Complete the practice goal, or record exactly where I need help.
- [ ] Agree on the next step with the teacher.

**What I understand:**  
_Write 2–3 short points._

**What needs review:**  
_Write one or two questions; uncertainty is normal._

**Next step:**  
__________

**Week finished on:** __________
### Week 11 — Infrastructure as code

**Learning goal:** Read and modify basic SAM/CloudFormation templates.  
**Practice goal:** Deploy a small application and clean up resources.

- [ ] Monday: concept and worked example.
- [ ] Tuesday: guided practice.
- [ ] Wednesday: rest.
- [ ] Thursday: next concept and short questions.
- [ ] Friday: apply this week's ideas.
- [ ] Saturday: review and write the weekly summary.
- [ ] Sunday: rest.
- [ ] Explain the learning goal in my own words.
- [ ] Complete the practice goal, or record exactly where I need help.
- [ ] Agree on the next step with the teacher.

**What I understand:**  
_Write 2–3 short points._

**What needs review:**  
_Write one or two questions; uncertainty is normal._

**Next step:**  
__________

**Week finished on:** __________
### Week 12 — CI/CD and releases

**Learning goal:** Explain build artifacts, automated tests, traffic shifting, and rollback.  
**Practice goal:** Trace a release from source through deployment.

- [ ] Monday: concept and worked example.
- [ ] Tuesday: guided practice.
- [ ] Wednesday: rest.
- [ ] Thursday: next concept and short questions.
- [ ] Friday: apply this week's ideas.
- [ ] Saturday: review and write the weekly summary.
- [ ] Sunday: rest.
- [ ] Explain the learning goal in my own words.
- [ ] Complete the practice goal, or record exactly where I need help.
- [ ] Agree on the next step with the teacher.

**What I understand:**  
_Write 2–3 short points._

**What needs review:**  
_Write one or two questions; uncertainty is normal._

**Next step:**  
__________

**Week finished on:** __________
### Week 13 — Monitoring and debugging

**Learning goal:** Use metrics, logs, and tracing to investigate a failure.  
**Practice goal:** Follow evidence to identify an application problem.

- [ ] Monday: concept and worked example.
- [ ] Tuesday: guided practice.
- [ ] Wednesday: rest.
- [ ] Thursday: next concept and short questions.
- [ ] Friday: apply this week's ideas.
- [ ] Saturday: review and write the weekly summary.
- [ ] Sunday: rest.
- [ ] Explain the learning goal in my own words.
- [ ] Complete the practice goal, or record exactly where I need help.
- [ ] Agree on the next step with the teacher.

**What I understand:**  
_Write 2–3 short points._

**What needs review:**  
_Write one or two questions; uncertainty is normal._

**Next step:**  
__________

**Week finished on:** __________
### Week 14 — Performance and integration

**Learning goal:** Measure performance and connect the services learned so far.  
**Practice goal:** Improve and troubleshoot the small application.

- [ ] Monday: concept and worked example.
- [ ] Tuesday: guided practice.
- [ ] Wednesday: rest.
- [ ] Thursday: next concept and short questions.
- [ ] Friday: apply this week's ideas.
- [ ] Saturday: review and write the weekly summary.
- [ ] Sunday: rest.
- [ ] Explain the learning goal in my own words.
- [ ] Complete the practice goal, or record exactly where I need help.
- [ ] Agree on the next step with the teacher.

**What I understand:**  
_Write 2–3 short points._

**What needs review:**  
_Write one or two questions; uncertainty is normal._

**Next step:**  
__________

**Week finished on:** __________
### Week 15 — Mixed practice and gap repair

**Learning goal:** Explain choices on unfamiliar scenarios across exam domains.  
**Practice goal:** Review mistakes and revisit weak topics.

- [ ] Monday: concept and worked example.
- [ ] Tuesday: guided practice.
- [ ] Wednesday: rest.
- [ ] Thursday: next concept and short questions.
- [ ] Friday: apply this week's ideas.
- [ ] Saturday: review and write the weekly summary.
- [ ] Sunday: rest.
- [ ] Explain the learning goal in my own words.
- [ ] Complete the practice goal, or record exactly where I need help.
- [ ] Agree on the next step with the teacher.

**What I understand:**  
_Write 2–3 short points._

**What needs review:**  
_Write one or two questions; uncertainty is normal._

**Next step:**  
__________

**Week finished on:** __________
### Week 16 — Readiness review

**Learning goal:** Demonstrate understanding, practical ability, and consistent fresh-test performance.  
**Practice goal:** Decide whether to book the exam or extend the plan.

- [ ] Monday: concept and worked example.
- [ ] Tuesday: guided practice.
- [ ] Wednesday: rest.
- [ ] Thursday: next concept and short questions.
- [ ] Friday: apply this week's ideas.
- [ ] Saturday: review and write the weekly summary.
- [ ] Sunday: rest.
- [ ] Explain the learning goal in my own words.
- [ ] Complete the practice goal, or record exactly where I need help.
- [ ] Agree on the next step with the teacher.

**What I understand:**  
_Write 2–3 short points._

**What needs review:**  
_Write one or two questions; uncertainty is normal._

**Next step:**  
__________

**Week finished on:** __________
## Session log

Keep one row per session. An introductory lesson is already recorded.

| Session | Topic | What I learned | Revisit | Next action |
|---|---|---|---|---|
| Intro | IAM, Lambda and S3 | GetObject/PutObject; prefix scope; least privilege; avoid hardcoded keys | Explicit versus implicit deny; execution versus resource permissions | Start the foundations plan |
| 1 — 2026-09-08 | Secrets Manager preview (out of sequence) | Teacher explained storing an API token, retrieval through an execution role, and avoiding secret values in logs | Learner was unsure about logging risk; changing a stored token and access by other authorized roles need an independent recheck | Return to Week 1 foundations; defer Parameter Store comparison |
| 2 — 2026-09-08 | AWS Regions | Choose a nearby Region for lower latency; check service availability, pricing, and legal/data-residency requirements; cross-Region calls can add latency and transfer cost | Avoid claiming geography guarantees the lowest latency; network routing also matters | Learn Availability Zones |
| 3 — 2026-09-08 | Availability Zones | Multiple instances in one AZ protect against an instance failure, but not an AZ failure; multiple AZs improve availability within one Region | Multi-AZ does not protect against failure of the whole Region | Complete the Week 1 architecture exercise and summary |
| 4 — 2026-09-08 | Week 1 architecture exercise and summary | Place EC2 instances across AZs; S3 and ordinary Lambda are Regional services and are not moved between AZs | Cross-account permissions return in Week 2 | Begin Week 2 IAM and S3 permissions |
| 5 — 2026-09-09 | Execution role versus Lambda resource policy | Execution role controls calls made by function code; the Lambda resource policy authorizes S3 to invoke the function | Recheck why missing allow differs from explicit deny; identify the failing action before choosing a policy | Study IAM policy evaluation |
| 6 — 2026-09-09 | IAM policy evaluation | Match the requested action and resource to applicable statements; no matching PutObject allow results in implicit deny; explicit deny overrides allow | Continue distinguishing implicit deny from explicit deny in new scenarios | Write a least-privilege S3 policy |
| 7 — 2026-09-09 | Least-privilege S3 object policy | Correctly wrote separate GetObject permission for originals and PutObject permission for thumbnails | GetObject reads a known object but cannot list a prefix; ListBucket is a separate bucket-level action | Learn ListBucket with a prefix condition |
| 8 — 2026-09-09 | ListBucket and prefix conditions | ListBucket uses the bucket ARN; GetObject is separately required to download an object; correctly identified implicit deny for a missing GetObject allow | Recheck that a prefix condition restricts the ListBucket request and does not grant access to a different prefix | Complete an independent policy review and Week 2 summary |
| 9 — 2026-09-09 | Week 2 independent policy review | Correctly classified all five requests by matching action, resource, and condition; distinguished allowed requests from implicit denies | Apply the same method to unfamiliar scenarios; revisit cross-account access later | Begin Week 3 Lambda and AWS SDKs |
| 10 — 2026-09-10 | Lambda handlers and S3 events | The S3 event supplies the bucket name and object key; the execution role supplies permissions; correctly identified s3:GetObject | Reinforce that application code calls the S3 GetObject API through an AWS SDK client | Learn AWS SDK calls and temporary role credentials |
| 11 — 2026-09-10 | AWS SDK and temporary credentials | Lambda assumes the execution role, provides temporary credentials, and the SDK automatically uses them; copied credentials expire and rotate | Remember that the Lambda service normally assumes the execution role, rather than application code calling AssumeRole | Learn Lambda timeout and error behavior |
| 12 — 2026-09-10 | Lambda timeouts and external calls | Lambda stops work at its configured timeout; external-call timeouts should leave time for the handler to react; slow dependencies should be investigated | Increasing the Lambda timeout cannot prevent duplicate side effects when the outcome of an external request is unknown; learn idempotency keys | Study idempotency and invocation error handling |
| 13 — 2026-09-10 | Synchronous and asynchronous Lambda errors | API Gateway waits for a synchronous result; S3 commonly invokes asynchronously and a failed event can be retried or sent to a failure destination | A dead-letter queue preserves failed events but does not prevent duplicate database effects; reinforce idempotency | Learn idempotency keys and conditional writes, then continue to concurrency |

| 14 - 2026-09-11 | Idempotency and conditional writes | Recognized that the same order must not be created twice; identified that new random IDs fail to prevent duplicates | A fresh ID PASSES the not-exists condition. Retries need the same business ID. Subsequent side effects need their own protection. Understanding needs a brief recheck; progress stays at 60%. | Recheck stable IDs, then learn Lambda concurrency |

| 15 - 2026-09-11 | Idempotency recheck and basic concurrency | Correctly reused order-789 and identified the existing-item condition; correctly calculated 5 running minus 2 finished as 3 concurrent invocations | A conditional-write rejection need not fail Lambda if handled appropriately; an unhandled error does fail the invocation | Learn reserved concurrency and throttling, then complete practical logging |

| 16 - 2026-09-11 | Reserved concurrency and throttling | Correctly predicted that a fourth invocation cannot start at a limit of three and can start once a slot is free | Three running minus one finished leaves TWO running, not zero. A direct synchronous request is throttled rather than automatically queued. Both points need a short recheck. | Recheck counting and synchronous throttling, then continue to practical logging |

| 17 - 2026-09-12 | Concurrency recheck and CloudWatch logging introduction | Correctly identified synchronous throttling and calculated two running invocations with two free slots | Automatic log delivery still requires execution-role permissions. A role allowing only s3:GetObject cannot upload CloudWatch logs. Recheck this distinction. | Recheck logging permissions, then run and inspect a small logging example |

| 18 - 2026-09-12 | Logging policy attachment and handler tracing | Correctly predicted Processing started then Missing orderId for an empty event, and Processing started then Processing completed when orderId is present | AWSLambdaBasicExecutionRole is a policy attached to the execution role. Code-reading is complete; actual execution and log inspection are still pending. | Briefly recheck policy attachment, then run the two test events and inspect logs |

| 19 - 2026-09-12 | Error logs versus invocation failures | Correctly identified that an uncaught throw fails the invocation after explanation | Initially treated return { success: false } as an invocation failure. A normal return completes the invocation successfully; console.error only logs. Independently recheck the normal-return case. | Briefly recheck return versus throw and role-policy attachment, then resume practical logging |

| 20 - 2026-10-05 | Recall and learner-run logging exercise | Correctly identified successful invocation with return { success: false }; ran the local exercise and confirmed ERROR Invalid event for the empty event and SUCCESS for the valid event | Policy attachment still needs independent recheck: attach AWSLambdaBasicExecutionRole to the execution role. Initial MODULE_NOT_FOUND was resolved by running the full file path. | Plan AWS logging practice and final Week 3 review |

| 21 - 2026-10-05 | Logging permissions and CloudWatch walkthrough | Correctly attached AWSLambdaBasicExecutionRole to StudyLambdaRole and answered that console.log alone cannot ensure CloudWatch delivery without log permissions | Learner prefers no AWS account or paid resources; CloudWatch was explained, not inspected in AWS | Complete a short Week 3 review using local examples and explanations |

| 22 - 2026-10-05 | Week 3 idempotency review | Correctly identified rejection when a retry conditionally creates the existing order-789 after explanation | Initially thought fresh random IDs prevent duplicates. Each fresh ID passes the not-exists condition; retries must reuse the stable business ID. Recheck independently. Conditional-write rejection is not automatically an invocation failure if handled. | One brief independent ID recheck, then close Week 3 and begin Week 4 |

| 23 - 2026-10-05 | API Gateway introduction and HTTP requests | Learner requested moving to Week 4. Correctly placed price calculation in Lambda, chose GET for an existing order, and POST for creation | Teacher clarified that API Gateway sends the client response and JSON creation data goes in the request body rather than generically named params. Independently recheck those distinctions. | Learn pathParameters, queryStringParameters, and body in a Lambda proxy event |

| 24 - 2026-10-05 | HTTP API request event fields and body parsing | Correctly chose event.queryStringParameters for includeItems and JSON.parse(event.body) before accessing order.quantity | Query values are strings. The example body is JSON text and is not base64 encoded; malformed or absent bodies will need validation in a later lesson. | Learn Lambda proxy response statusCode, headers, and body |

| 25 - 2026-10-05 | Lambda proxy response format | Correctly chose 201 Created for a new order and JSON.stringify(result) for body in an explicit proxy response | Distinguish client HTTP status from Lambda invocation success when learning validation errors | Validate input and return HTTP 400 without an uncaught exception |

| 26 - 2026-10-05 | Input validation and HTTP versus invocation outcome | Correctly chose 400 Bad Request for negative quantity and identified successful Lambda invocation when returning 400 normally | Basic field validation covered; malformed or absent JSON body handling remains ahead | Catch JSON.parse errors and return an appropriate client response |

| 27 - 2026-10-10 | Malformed JSON and field validation | Correctly identified early return from catch for malformed JSON; correctly identified parsing success followed by field rejection for quantity 0 | Missing bodies and JSON values such as null also require input checks in a combined exercise | Local request/response exercise with valid order, invalid quantity, and malformed JSON |

| 28 - 2026-10-10 | Learner-run local request/response exercise | Learner confirmed output matched all five expected cases: valid order 201; invalid quantity, malformed JSON, missing body, and JSON null 400; each handler returned normally | This was a local simulation with no real API Gateway, AWS calls, or persisted orders | API Gateway stages and deployments walkthrough |

| 29 - 2026-10-10 | HTTP API stages and deployments | Correctly chose dev to test a new route and identified the previous deployment remains served with automatic deployment disabled until a new deployment is assigned | Deployment snapshots API configuration; stage names alone do not isolate backend data or freeze Lambda code | Lambda invocation permission for API Gateway, then remaining Week 4 topics and review |

| 30 - 2026-10-10 | API Gateway invocation permissions | Correctly chose Lambda resource-based policy for API Gateway invocation and execution role for missing s3:GetObject permission in running code | An S3 AccessDenied may also involve bucket policies or other applicable controls; selecting the role here identifies where the missing identity permission belongs | Short mixed Week 4 review and summary |

| 31 - 2026-10-10 | Week 4 mixed review and summary | Correctly identified HTTP 400 with successful Lambda completion, and previous deployment A remaining active until a new deployment is assigned to dev | Teacher clarified the release step: create a new deployment from updated API configuration and assign it to the stage. No real API deployment performed. | Begin Week 5 DynamoDB basics |

| 32 - 2026-10-12 | DynamoDB tables, items, and simple primary keys | Correctly selected orderId to retrieve an order and identified that two separate items cannot share the full primary key | Learner generalized uniqueness to all partition keys; teacher clarified that this applies to partition-key-only tables, while composite keys permit a shared partition key with distinct sort keys. A write to an existing key is not necessarily rejected without a condition. | Learn composite primary keys using customerId and orderId |

| 33 - 2026-10-12 | Composite primary keys and GetItem | Correctly allowed customer-12/order-792 because the key pair is unique; correctly required both customerId and orderId to retrieve one exact item with GetItem | Partition key alone can be used with Query to retrieve multiple matching items; this is the next lesson | Query versus GetItem for customer orders |

| 34 - 2026-10-12 | Query versus GetItem | Correctly chose Query for customer-12's orders and both customerId and orderId for one exact GetItem lookup | Use exact attribute casing in code: orderId. Query requires partition-key equality; optional sort-key conditions narrow results. Larger result sets need pagination. | Query versus Scan and filtering |

| 35 - 2026-10-12 | Query versus Scan and filtering | Correctly chose Query for customer-12's orders and answered that filtering a full Scan down to three results does not reduce read capacity to those three items | A full Scan may need multiple pages; filters apply after items are read | PutItem replacement behavior and conditional creation |

| 36 - 2026-10-12 | PutItem and conditional creation | Correctly identified that unconditional PutItem replaces the existing item with the same full key | Incorrectly predicted replacement with attribute_not_exists(customerId); teacher explained that an existing item makes the condition false, rejecting the write. Independent recheck pending. | Brief conditional-write recheck before continuing |

| 37 - 2026-10-23 | Conditional-create recheck | Correctly identified attribute_not_exists(customerId) as false at an existing full key and allowed creation at a new full key with the same customerId and different orderId | Conditions are evaluated against the item at the full supplied key, not every item sharing the partition key. Stable-versus-random retry IDs remain for later review. | UpdateItem versus PutItem |

| 38 - 2026-10-23 | UpdateItem and requiring an existing item | Correctly selected UpdateItem for changing quantity while preserving status; correctly rejected an update at a missing full key with attribute_exists(customerId) | Without a condition, UpdateItem can create an item. Existence conditions apply at the complete supplied key. | Pagination for Query and Scan |

| 39 - 2026-10-23 | Query pagination | Correctly mapped the response LastEvaluatedKey to the next request ExclusiveStartKey | Initially stopped on an empty filtered Items array despite a non-empty LastEvaluatedKey. Filtering can discard all items in a page while later pages remain to be evaluated. Continue until no non-empty LastEvaluatedKey is returned. | Recheck stopping rule, then local DynamoDB simulation |

| 40 - 2026-10-23 | Pagination stopping-rule recheck | Correctly stopped after processing a page with no LastEvaluatedKey | Again chose to stop when Items was empty despite a non-empty bookmark. Empty-page continuation is not yet independently understood. Teacher used a book-page analogy. | Local multi-page demonstration showing a later matching item |

| 41 - 2026-10-23 | Concrete pagination walkthrough | Correctly identified order-791 would be missed by stopping at the empty first page, and correctly used LastEvaluatedKey as ExclusiveStartKey to request the next page | Teacher ran the local demonstration; learner's own execution is unconfirmed. Revisit the stopping rule later with an unfamiliar example. | Local item-operation practice, then mixed Week 5 review |

| 42 - 2026-10-23 | Guided local item-operation trace | Correctly preserved pending status when only quantity was updated; correctly predicted omitted status after PutItem | Described same-key PutItem as creating a new item; teacher clarified replacement, not a second record. Learner execution unconfirmed. | Fresh replacement example later |
| 43 - 2026-10-23 | Mixed Week 5 review | Correctly chose Query for a customer's orders and used returned LastEvaluatedKey as ExclusiveStartKey despite empty Items | Gave customerID as a value; teacher distinguished attribute name customerId from value customer-12 and noted exact casing. | Short wrap-up and replacement recheck |

| 44 - 2026-10-23 | Fresh replacement example and Week 5 summary | Correctly identified only productId and price remain after same-key PutItem omits category; teacher reinforced replacement leaves one record | Independent local script execution remains unconfirmed; conceptual lessons and guided review are complete | Begin Week 6 secondary indexes; retain local practice gap |

| 45 - 2026-10-28 | Week 6 GSI introduction and progress audit | Teacher introduced OrderIdIndex with orderId as its partition key, compared with customerId on the base table; DynamoDB maintains the index from base-table writes | First question remains unanswered. Introduction is not counted as a completed lesson. Corrected stale roadmap and permission-review entries. | Resume GSI question 1, then question 2 |

| 46 - 2026-10-28 | GSI introduction review | Correctly selected OrderIdIndex for a query with only orderId known; correctly chose the base Orders table as the write target | Automatic index maintenance does not imply immediate visibility; eventual consistency is next | Explain delayed GSI visibility after a successful base-table write |

| 47 - 2026-11-03 | GSI eventual consistency | Correctly explained that GSI update may still be pending after a successful write; correctly selected base-table GetItem with the full key and ConsistentRead: true for a strongly consistent read | GSI reads do not support strong consistency. Continue review with the GSI/LSI comparison. | GSI versus LSI, in Vietnamese |

**Latest next step (2026-11-03):** Two-question GSI consistency lesson complete. Next: GSI versus LSI, partition keys and read consistency. Continue in Vietnamese without AWS access or paid resources. Week 6: 20%; overall roadmap remains 32% rounded. Week 5 independent execution and Week 3 idempotency-ID review remain pending. Percentages describe topic coverage, not exam readiness.

### Reusable end-of-lesson summary

**Date / session:** __________  
**Today's one objective:** __________

- [ ] Reviewed earlier learning.
- [ ] Learned one concept.
- [ ] Tried an example or exercise.
- [ ] Explained the idea in my own words.
- [ ] Recorded an uncertainty.
- [ ] Stopped at the agreed time.

**Three things to remember:**
1. __________
2. __________
3. __________

**One thing to revisit:** __________  
**Next session begins with:** __________  
**Energy today:** Low / Medium / High

## Readiness checklist — no rush to book

- [ ] Check the current official exam version and objectives before booking.
- [ ] Review every exam domain and identify remaining gaps.
- [ ] Explain core concepts without relying on memorized answers.
- [ ] Complete core practical exercises with decreasing help.
- [ ] Explain why incorrect choices do not meet scenario requirements.
- [ ] Complete fresh mixed practice, including multiple-response questions.
- [ ] Review errors and repeat the underlying concepts, not just the questions.
- [ ] Complete full timed practice in a planned longer session.
- [ ] Show consistent performance on several fresh, reputable practice tests.
- [ ] Agree with the teacher that major gaps are addressed.
- [ ] Choose an exam date and leave time for rest beforehand.
- [ ] Take the certification exam.

A suggested teaching benchmark is approximately 80–85% on several fresh practice tests, alongside practical understanding. This is not an AWS scaled-score conversion or a guarantee of passing. Extend the roadmap whenever useful.

## Reference

- [Official DVA-C02 exam guide](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02.html)
- [AWS Developer Associate certification information](https://aws.amazon.com/certification/certified-developer-associate/)

## Process review — 2026-09-08

- [x] Recalled earlier IAM/S3 learning at the start of the session.
- [x] Used one stated topic and two short questions.
- [x] Explained the uncertainty and provided an end-of-session summary.
- [x] Stopped after the two questions.
- [x] Recorded the session in this checklist during the process review.
- [ ] Confirm programming experience and preferred daily study time.
- [ ] Begin Week 1: AWS accounts, Regions, and Availability Zones.
- [ ] Recheck the Secrets Manager concepts later without hints.

**Correction:** The teacher skipped ahead to a Week 10 topic instead of following the recorded next step. This preview does not complete Week 10. The previously suggested Parameter Store lesson is deferred until the appropriate stage.

**Time and rest:** Actual session duration and rest-day activity were not recorded, so the 45-minute schedule cannot be verified. Do not check calendar-day boxes without evidence.

**Next session:** Confirm experience and available time, then teach one Week 1 foundation concept. End with a short summary and update this file. No additional lesson is required today.
## Our learning agreement

- We work on one manageable objective at a time.
- Every lesson ends with a summary and a next step.
- Mistakes guide the next explanation; they are not a reason to rush.
- Rest days stay in the plan.
- We reassess the pace after two weeks.
- Keep this file as the study record. In a new conversation, share its latest version so the teacher can resume from the right place.















