const schema = {
	validator: {
		$jsonSchema: {
			properties: {
				username: {
                    type: "string"
                },
                email: {
                    type: 'string'
                },
                image: {
                    type: "string"
                },
                password: {
                    type: "string"
                }
            },
            required: [
                "username", "email", "image", "password"
            ]
		}
	}
}

module.exports = schema