import React, { useState, useEffect } from 'react';
import { Clock, Users, ArrowUpRight, ChefHat } from 'lucide-react';

const RECIPES = [
  {
    id: 1,
    title: "Poondu Podi Ghee Rice",
    desc: "The ultimate South Indian comfort food. Simple, quick, and bursting with fresh garlic aroma.",
    prepTime: "5 mins",
    cookTime: "5 mins",
    serves: "1-2",
    difficulty: "Easy",
    productUsed: "Poondu Podi (Garlic Podi)",
    ingredients: [
      "2 cups Cooked Steaming Hot Ponni Rice",
      "2-3 tablespoons Thulasia Poondu Podi",
      "2 tablespoons Cow Ghee (or Gingelly Oil)",
      "A sprig of Fresh Curry Leaves",
      "Roasted Cashew Nuts (optional)"
    ],
    steps: [
      "Ensure your cooked rice is steaming hot and individual grains are separate.",
      "Transfer hot rice to a wide mixing bowl.",
      "Add 2 tablespoons of warm cow ghee (or raw sesame oil) over the rice.",
      "Sprinkle Thulasia Poondu Podi evenly over the ghee and rice.",
      "Gently fold and mix using a wooden spatula so the spice mix coats every grain without mashing the rice.",
      "Garnish with ghee-fried curry leaves and cashews. Serve warm with papad or potato fry."
    ]
  },
  {
    id: 2,
    title: "Crispy Gunpowder Podi Idli",
    desc: "Tavern-style mini idlis coated in toasted gunpowder and cold-pressed gingelly oil.",
    prepTime: "10 mins",
    cookTime: "8 mins",
    serves: "2-3",
    difficulty: "Easy",
    productUsed: "Idli Milagai Podi",
    ingredients: [
      "15 Mini Idlis (or 4 regular idlis cut into cubes)",
      "3 tablespoons Thulasia Idli Milagai Podi",
      "3 tablespoons Gingelly (Sesame) Oil",
      "1/2 teaspoon Mustard Seeds",
      "1/2 teaspoon Urad Dal",
      "1 sprig Curry Leaves"
    ],
    steps: [
      "Steam the idlis and let them cool down slightly so they don't break when tossed.",
      "Heat gingelly oil in a pan. Add mustard seeds and let them splutter.",
      "Add urad dal and fry till it turns golden brown. Toss in the curry leaves.",
      "Turn the flame to low. Add the mini idlis and saute for 2 minutes till they get a light outer crust.",
      "Sprinkle Thulasia Idli Milagai Podi (Gunpowder) over the idlis.",
      "Toss gently on low heat for 1 minute until the podi forms a nice crispy coat. Serve hot with coconut chutney."
    ]
  },
  {
    id: 3,
    title: "Traditional Erode Murungakkai Sambar",
    desc: "An aromatic lentil stew cooked with drumsticks and small onions, using our native spice blend.",
    prepTime: "15 mins",
    cookTime: "20 mins",
    serves: "4",
    difficulty: "Medium",
    productUsed: "Chettinad Sambar Masala",
    ingredients: [
      "1/2 cup Toor Dal (boiled and mashed)",
      "1 Drumstick (cut into 2-inch pieces)",
      "10 Pearl Onions (shallots, peeled)",
      "1 Tomato (chopped)",
      "Small gooseberry-sized Tamarind (soaked in warm water)",
      "2-3 tablespoons Thulasia Sambar Masala",
      "Salt to taste",
      "For tempering: 1 tsp oil, 1/2 tsp mustard seeds, 1/4 tsp fenugreek, 1 red chilli, asafoetida"
    ],
    steps: [
      "Extract tamarind juice from the soaked tamarind and set aside.",
      "In a pot, boil drumstick, shallots, and tomato in tamarind juice with salt and a pinch of turmeric until vegetables are soft.",
      "Add the mashed toor dal to the boiling vegetable broth.",
      "Stir in 2-3 tablespoons of Thulasia Sambar Masala. Add water to adjust consistency.",
      "Simmer on medium flame for 5-7 minutes until the raw masala aroma disappears and the sambar thickens.",
      "In a separate small pan, heat oil, add tempering ingredients, and pour it into the hot sambar. Cover immediately to lock in the aroma. Serve with hot rice or idli."
    ]
  },
  {
    id: 4,
    title: "Iron-Rich Curry Leaf Rice",
    desc: "A healthy, herbaceous lunchbox rice packed with the goodness of roasted curry leaves.",
    prepTime: "5 mins",
    cookTime: "10 mins",
    serves: "2",
    difficulty: "Easy",
    productUsed: "Karuveppilai Podi",
    ingredients: [
      "2 cups Cooked Basmati or Ponni Rice (cooled)",
      "3 tablespoons Thulasia Karuveppilai Podi",
      "1.5 tablespoons Gingelly Oil",
      "1 tablespoon Roasted Peanuts",
      "1/2 tsp Mustard Seeds",
      "1 Red Chilli"
    ],
    steps: [
      "Ensure the cooked rice is cool to prevent clumping.",
      "Heat gingelly oil in a pan, splutter mustard seeds and red chilli.",
      "Add roasted peanuts and saute for 1 minute until crunchy.",
      "Turn off the heat. Add the cooled rice to the pan.",
      "Sprinkle Thulasia Karuveppilai Podi over the rice.",
      "Gently mix the rice until the green spice mix is evenly distributed. Pack for lunch or serve with potato chips."
    ]
  }
];

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const res = await fetch('/api/recipes');
      const data = await res.json();
      setRecipes(data);
    } catch (err) {
      console.error('Failed to fetch recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ padding: '60px 0 100px' }} className="animate-fade-in">
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '2px' }}>Kitchen Inspiration</span>
          <h2 style={{ fontSize: '36px', fontWeight: 800, marginTop: '8px' }}>Thulasia Recipe Hub</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '12px auto 0' }}>
            Learn how to cook authentic, traditional South Indian dishes using Thulasia Foods spice blends and podis.
          </p>
        </div>

        {/* Recipes Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(17,61,38,0.1)',
              borderTop: '3px solid var(--primary)',
              borderRadius: '50%',
              margin: '0 auto 16px',
              animation: 'spin 1s linear infinite'
            }} />
            <p>Loading kitchen recipes...</p>
          </div>
        ) : recipes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '16px', fontWeight: 600 }}>No recipes listed yet.</p>
            <p style={{ fontSize: '13px' }}>Check back soon for cooking inspiration!</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '30px',
            marginBottom: '50px'
          }}>
            {recipes.map(recipe => (
              <div 
                key={recipe.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%'
                }}
              >
                <div style={{
                  padding: '24px',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  minHeight: '120px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <div style={{ position: 'absolute', right: '16px', top: '16px', color: 'rgba(255,255,255,0.1)' }}>
                    <ChefHat size={36} />
                  </div>
                  <span className="badge badge-accent" style={{ alignSelf: 'flex-start', marginBottom: '8px', fontSize: '10px' }}>
                    {recipe.productUsed}
                  </span>
                  <h3 style={{ color: 'white', fontSize: '20px', fontWeight: 800 }}>{recipe.title}</h3>
                </div>

                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
                      {recipe.desc}
                    </p>

                    <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} />
                        <span>{recipe.prepTime} prep</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} />
                        <span>{recipe.cookTime} cook</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Users size={12} />
                        <span>Serves {recipe.serves}</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setSelectedRecipe(recipe)}
                    className="btn btn-outline"
                    style={{
                      width: '100%',
                      padding: '10px',
                      fontSize: '13px'
                    }}
                  >
                    View Cooking Steps
                    <ArrowUpRight size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recipe Detail View Modal */}
        {selectedRecipe && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 150,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }} onClick={() => setSelectedRecipe(null)}>
            <div className="card animate-fade-in" style={{
              maxWidth: '600px',
              width: '100%',
              backgroundColor: 'white',
              borderRadius: '20px',
              overflow: 'hidden',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column'
            }} onClick={e => e.stopPropagation()}>
              
              {/* Modal Header */}
              <div style={{
                padding: '24px 30px',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'var(--primary)',
                color: 'white'
              }}>
                <div>
                  <span className="badge badge-accent" style={{ marginBottom: '4px', fontSize: '9px' }}>{selectedRecipe.productUsed}</span>
                  <h3 style={{ color: 'white', fontSize: '22px', fontWeight: 800 }}>{selectedRecipe.title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedRecipe(null)}
                  style={{ border: 'none', background: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' }}
                >
                  &times;
                </button>
              </div>

              {/* Modal Scroll Body */}
              <div style={{ padding: '30px', overflowY: 'auto', flex: 1 }}>
                
                {/* Ingredients */}
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '16px', color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '12px' }}>
                    Ingredients Needed
                  </h4>
                  <ul style={{ paddingLeft: '20px', fontSize: '14px', color: 'var(--text-dark)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {selectedRecipe.ingredients.map((ing, idx) => (
                      <li key={idx}>{ing}</li>
                    ))}
                  </ul>
                </div>

                {/* Steps */}
                <div>
                  <h4 style={{ fontSize: '16px', color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '16px' }}>
                    Step-by-Step Instructions
                  </h4>
                  <ol style={{ paddingLeft: '20px', fontSize: '14px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {selectedRecipe.steps.map((step, idx) => (
                      <li key={idx} style={{ paddingLeft: '4px' }}>
                        <span style={{ color: 'var(--text-dark)', fontWeight: 600 }}>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Modal Footer */}
              <div style={{
                padding: '16px 30px',
                borderTop: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-cream)',
                textAlign: 'right'
              }}>
                <button 
                  onClick={() => setSelectedRecipe(null)}
                  className="btn btn-primary"
                  style={{ padding: '8px 24px', fontSize: '13px' }}
                >
                  Got it, Thanks!
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
