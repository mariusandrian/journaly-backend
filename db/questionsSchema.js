const schema = {
	validator: {
		$jsonSchema: {
			properties: {
                content: {
                    type: "string"
                }
            },
            required: [
                "content"
            ]
		}
	}
}

module.exports = schema