let pollsData = $state([
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

// Derived stats as internal reactive values
let totalPolls = $derived(pollsData.length);
let totalVotes = $derived(
    pollsData.reduce((sum, poll) => sum + poll.totalVotes, 0)
);
let averageVotesPerPoll = $derived(
    pollsData.length > 0 ? (totalVotes / pollsData.length).toFixed(1) : '0.0'
);

// Export polls through a getter function
export function getPolls() {
    return pollsData;
}

// Export derived stats through getter functions
export function getTotalPolls() {
    return totalPolls;
}

export function getTotalVotes() {
    return totalVotes;
}

export function getAverageVotesPerPoll() {
    return averageVotesPerPoll;
}

export function getStats() {
    return {
        totalPolls: totalPolls,
        totalVotes: totalVotes,
        averageVotesPerPoll: averageVotesPerPoll
    };
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

    pollsData = [newPoll, ...pollsData];
}

export function vote(pollId, optionId) {
    const poll = pollsData.find(p => p.id === pollId);
    if(poll) {
        const option = poll.options.find(o => o.id === optionId);
        if(option) {
            option.votes += 1;
            poll.totalVotes += 1;
        }
    }
}

export function deletePoll(pollId) {
  pollsData = pollsData.filter(p => p.id !== pollId);
}

export function selectPoll(poll) {
    selectedPoll = poll;
}

export function clearSelectedPoll() {
    selectedPoll = null;
}