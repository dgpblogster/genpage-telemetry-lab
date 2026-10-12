// Deliberate failure for the telemetry demo. Remove before sharing the page.
//
// How to use: copy the <button> element below (not the export line) into the JSX your
// generated page returns. In the app designer open the page, go to the Code tab, select
// Edit, paste, then Save (which commits the edit as a new iteration) and Save and Publish.
//
// Why async: the thrown error does not surface as an ordinary exception. It becomes a
// rejected promise that nothing catches, which is one of the two error classes the docs
// say generative pages record ("unhandled page-rendering errors and unhandled promise
// rejections"). A plain HTML <button> pastes cleanly into any generated page, whatever
// component library the agent chose.
//
// Change the message to something you can search for in queries/03-exceptions.kql.

export const breakMeButton = (
  <button
    type="button"
    onClick={async () => {
      // Deliberate failure for the telemetry demo. Remove before sharing the page.
      throw new Error("Telemetry smoke test: unhandled promise rejection");
    }}
  >
    Break me
  </button>
);
