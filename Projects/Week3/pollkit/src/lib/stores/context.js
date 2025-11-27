// Svelte context store for managing poll state across components
// poll state means - such as - the list of polls, selected poll, and related actions
import { setContext, getContext } from "svelte";


// POLL_CONTEXT_KEY -- A unique key to identify the poll context store
// used to -- set and get the poll store in Svelte components
// used by -- setPollContext and getPollContext functions
// called by -- various components that need access to poll state
const POLL_CONTEXT_KEY = Symbol('pollContext');

// Functions to set and get the poll context store
export function setPollContext(store) {
    setContext(POLL_CONTEXT_KEY, store);
}

export function getPollContext() {
    return getContext(POLL_CONTEXT_KEY);
}