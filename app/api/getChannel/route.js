import clientPromise from "@/lib/mongodb";

export default async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db("sample_mflix");
    const movies = await db
      .collection("movies")
      .find({})
      .sort({ metacritic: -1 })
      .toArray();

    return Response.json(movies);
  } catch (e) {
    console.error(e);
    return Response.error(
      "An error has occured. Try again later. (Error: )" + e
    );
  }
}
