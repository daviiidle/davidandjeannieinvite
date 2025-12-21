import { Navigation, Hero, Details, Story, RSVP, SeatingLookup, Footer } from './components';
import './App.css';

function App() {
  return (
    <div>
      <Navigation />

      <main id="main-content">
        <Hero
          groomName="David Le"
          brideName="Jeannie Chiu"
          ceremonyTime="1pm"
          ceremonyLocation="Holy Family Parish"
          ceremonyAddress="46A Ballarat Rd, Maidstone VIC 3012"
          receptionTime="6pm"
          receptionLocation="Ultima Function Centre"
          receptionAddress="Corner of Ely Court, Keilor Park Dr, Keilor East VIC 3042"
        />
        <Details
          ceremonyCard={{
            heading: "Ceremony",
            time: "3:00 PM",
            location: "Holy Family Parish",
            address: "46A Ballarat Rd, Maidstone VIC 3012",
            description: "Please arrive 15 minutes early for seating"
          }}
          receptionCard={{
            heading: "Reception",
            time: "6:00 PM",
            location: "Ultima Function Centre",
            address: "Corner of Ely Court, Keilor Park Dr, Keilor East VIC 3042",
            description: "Dinner, drinks, and dancing to follow"
          }}
          dressCodeCard={{
            heading: "Dress Code",
            description: "Formal attire requested. Ladies: Evening gowns or formal dresses. Gentlemen: Tuxedos or dark suits with ties."
          }}
        />
        <Story />
        <SeatingLookup />
        <RSVP
          deadline="Please respond by September 1st, 2026"
          formUrl="https://forms.google.com/your-form-url"
          emails={["daviiidle@gmail.com", "jheea05@gmail.com"]}
        />
      </main>

      <Footer
        coupleName="David & Jeannie"
        email="daviiidle@gmail.com"
        showSocials={false}
      />
    </div>
  );
}

export default App;
