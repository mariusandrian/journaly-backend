const schema = {
	validator: {
		$jsonSchema: {
			properties: {
				user_id: {
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
                    type: "int"
                },
                replies: [{
                    user_id: {type: "string"},
                    username: {type: "string"},
                    content: {type: "string"}
                }],
            },
            required: [
                "user_id", "date", "content"
            ]
		}
	}
}

module.exports = schema