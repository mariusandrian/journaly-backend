const schema = {
	validator: {
		$jsonSchema: {
			properties: {
				user_id: {
                    type: "string"
                },
                username: {
                    type: "string"
                },
                date: {
                    type: 'string'
                },
                content: {
                    type: "string"
                },
                mood: {
                    type: "string"
                },
                moodIndicator: {
                    type: "number"
                },
                replies: {
                    type: "array"
                }
            },
            required: [
                "user_id", "date", "content", "username"
            ]
		}
	}
}

module.exports = schema