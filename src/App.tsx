import { Navigation, Hero, Details, Story, RSVP, SeatingLookup, Footer } from './components';
import './App.css';

function App() {
  return (
    <div>
      <Navigation />

      <main id="main-content">
        <Hero />
        <Details />
        <Story />
        <SeatingLookup />
        <RSVP
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
