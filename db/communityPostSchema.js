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
                question_id: {
                    type: "string"
                },
                replies: {
                    type: "array"
                },
                reactions: {
                    type: "array"
                }
            },
            required: [
                "user_id", "username", "date", "content", "question_id"
            ]
		}
	}
}

module.exports = schema