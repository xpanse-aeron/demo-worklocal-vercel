import fetch from "isomorphic-unfetch";

export default async function Coordinates (req, res) {
	try {
		await fetch("https://maps.googleapis.com/maps/api/distancematrix/json?origins="+ req.body.coordinates +"&destinations=14.47584617213881,121.19567387159655&key=AIzaSyDS2KtzKos2ZSc4ALwlxRZQzE_zDHcWRNg", {
			method: "GET"
		})
		.then((r) => r.json())
		.then(data => {
			res.status(200).json(data);
		})
	} catch (error) {
		res.status(error.status || 500).end(error.message);
	}
}