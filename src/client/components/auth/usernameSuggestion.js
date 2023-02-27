//
function usernameSuggestion(input) {
    function sanitizedInput() {
        const sanitized = input.replace(/[^a-zA-Z0-9]/g, "-")
        const parts = sanitized.split("-").filter((part) => part.length > 0)
        const suggestions = []
        const suffix = Math.floor(Math.random() * 1000)

        for (let i = 1; i <= parts.length; i++) {
            const combinations = getCombinations(parts, i)
            for (const combo of combinations) {
                const suggestion = combo.join("-")
                if (suggestion !== input) {
                    suggestions.push(suggestion)
                }
            }
        }

        suggestions.push(`${sanitized}-${suffix}`)
        return suggestions[Math.floor(Math.random() * suggestions.length)]
    }

    function getCombinations(arr, n) {
        const combinations = []
        const loop = (start, depth, combo) => {
            if (depth === n) {
                combinations.push(combo)
                return
            }
            for (let i = start; i <= arr.length - (n - depth); i++) {
                loop(i + 1, depth + 1, [...combo, arr[i]])
            }
        }
        loop(0, 0, [])
        return combinations
    }

    return [
        sanitizedInput(),
        sanitizedInput(),
        sanitizedInput(),
        sanitizedInput(),
    ]
}

const username = "john doe"
const username1 = "john doe"
console.log(usernameSuggestion(username))
console.log(usernameSuggestion(username1))
