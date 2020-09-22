const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
	functions.logger.info('Hello logs!', { structuredData: true });
	response.send('Hello World!');
});

exports.getIgnites = functions.https.onRequest((req, res) => {
	admin
		.firestore()
		.collection('ignites')
		.get()
		.then(data => {
			let ignites = [];
			data.forEach(doc => {
				ignites.push(doc.data());
			});
			return res.json(ignites);
		})
		.catch(err => console.error(err));
});

exports.createIgnite = functions.https.onRequest((req, res) => {
	if (req.method !== 'POST') {
		return res.status(400).json({ error: 'Method now allowed' });
	}
	const newIgnite = {
		body: req.body.body,
		userHandle: req.body.userHandle,
		createAt: admin.firestore.Timestamp.fromDate(new Date()),
	};

	admin
		.firestore()
		.collection('ignites')
		.add(newIgnite)
		.then(doc => {
			res.json({ message: `document ${doc.id} created successfully` });
		})
		.catch(err => {
			res.status(500).json({ error: 'something went wrong' });
			console.error(err);
		});
});
