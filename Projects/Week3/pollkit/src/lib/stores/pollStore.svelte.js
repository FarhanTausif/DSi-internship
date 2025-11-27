let polls = $state([
    {
        id: 1,
        question: "What is your favorite framework?",
        options: [
            { id: 1, text: "Svelte", votes: 0 },
            { id: 2, text: "React", votes: 0 },
            { id: 3, text: "Vue", votes: 0 },
            { id: 4, text: "Angular", votes: 0 },
        ],
        createdAt: new Date().toLocaleString(),
        totalVotes: 0,
    },
]);

let selectedPoll = $state(null);

// Derived stats
let totalPolls = $derived(polls.length);
let totalVotes = $derived(
    polls.reduce((sum, poll) => sum + poll.totalVotes, 0)
);

// Functions to interact with the poll store

export function getPolls() {
    return polls;
}

export function getStats() {
    return {totalPolls, totalVotes};
}

export function addPoll(question, options) {
    const newPoll = {
        id: Date.now(),
        question,
        options: options.map((text, index) => ({
            id: index+1,
            text,
            votes: 0,
        })),
        createdAt: new Date().toLocaleString(),
        totalVotes: 0,
    };

    polls = [newPoll, ...polls];
}

export function vote(pollId, optionId) {
    const poll = polls.find(p => p.id === pollId);
    if(poll) {
        const option = poll.options.find(o => o.id === optionId);
        if(option) {
            option.votes += 1;
            poll.totalVotes += 1;
        }
    }
}

export function deletePoll(pollId) {
  polls = polls.filter(p => p.id !== pollId);
}

export function selectPoll(poll) {
    selectedPoll = poll;
}

export function clearSelectedPoll() {
    selectedPoll = null;
}