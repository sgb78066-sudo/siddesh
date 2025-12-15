import { GoogleGenAI, Type } from "@google/genai";
import { Bin, CollectionRoute } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Uses Gemini to optimize the collection route for full bins.
 * It simulates a complex "Traveling Salesman Problem" solver.
 */
export const optimizeRouteAI = async (bins: Bin[]): Promise<CollectionRoute | null> => {
  // Filter only bins that need collection
  const fullBins = bins.filter(b => b.fillLevel > 50);
  
  if (fullBins.length === 0) return null;

  const binData = fullBins.map(b => ({
    id: b.id,
    location: b.locationName,
    coords: b.coordinates
  }));

  const prompt = `
    You are an expert logistics AI. 
    I have a waste collection truck starting at coordinates (0,0).
    Here is a list of bins that need collection: ${JSON.stringify(binData)}.
    
    Please optimize the driving route to visit all these bins in the most efficient order and return to (0,0).
    Calculate a rough total distance (Euclidean) and estimated time (assume 30km/h average speed).
    
    Return JSON only using this schema:
    {
      "stops": [list of bin IDs in order],
      "totalDistance": "string like '12.5 km'",
      "estimatedTime": "string like '25 mins'"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            stops: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            totalDistance: { type: Type.STRING },
            estimatedTime: { type: Type.STRING }
          }
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    
    // Reconstruct the route object
    const orderedBins = result.stops
      .map((id: string) => bins.find(b => b.id === id))
      .filter((b: Bin | undefined): b is Bin => !!b);

    return {
      id: `ROUTE-${Date.now()}`,
      driverName: 'Assigned by AI',
      vehicleId: 'TRUCK-AI-01',
      stops: orderedBins,
      totalDistance: result.totalDistance || '10 km',
      estimatedTime: result.estimatedTime || '30 mins',
      status: 'Pending'
    };

  } catch (error) {
    console.error("AI Route optimization failed:", error);
    // Fallback Mock Logic if API fails or key is missing
    return {
      id: `ROUTE-FALLBACK-${Date.now()}`,
      driverName: 'System Default',
      vehicleId: 'TRUCK-01',
      stops: fullBins,
      totalDistance: '15.2 km',
      estimatedTime: '45 mins',
      status: 'Pending'
    };
  }
};

/**
 * specific bin prediction based on simulated history
 */
export const predictOverflowAI = async (bin: Bin): Promise<string> => {
  // Simulate historical data points for the prompt
  const history = [
    { day: 'Monday', level: bin.fillLevel - 40 > 0 ? bin.fillLevel - 40 : 10 },
    { day: 'Tuesday', level: bin.fillLevel - 20 > 0 ? bin.fillLevel - 20 : 20 },
    { day: 'Today', level: bin.fillLevel }
  ];

  const prompt = `
    Analyze the fill rate of a waste bin.
    History: ${JSON.stringify(history)}.
    Current Level: ${bin.fillLevel}%.
    Bin Type: ${bin.type}.
    
    Predict how many hours from now it will reach 100% capacity.
    Return only a number representing hours.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hours: { type: Type.NUMBER }
          }
        }
      }
    });
    
    const data = JSON.parse(response.text || '{}');
    const hours = data.hours || 24;
    
    const futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + hours);
    return futureDate.toLocaleString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });

  } catch (e) {
    return "Tomorrow, 10:00 AM";
  }
};