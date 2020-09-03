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
                replies: {
                    type: "array"
                }
            },
            required: [
                "user_id", "date", "content"
            ]
		}
	}
}

module.exports = schema