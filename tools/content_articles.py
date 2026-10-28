"""Learning Center: homeowner guides that answer the questions people search
before they call a contractor. Plain, accurate, no invented statistics."""
from build_pages import article_cards_section, links_section

HUB = "/learning-center/"
PUBLISHED = "2026-10-28"
BIZ = {"@id": "https://www.prairieshieldwaterproofing.com/#business"}

ARTICLES = [
    dict(
        slug="why-is-my-basement-wet-after-rain",
        title="Why Is My Basement Wet After It Rains? 7 Common Causes",
        short="Why Is My Basement Wet After Rain?",
        desc="Seven reasons Chicago-area basements take on water after rain — from cracks and the cove joint to sewer backup and window wells — and how to tell which one you have.",
        summary="Seven ways water gets into a basement after a storm, and how to tell which one is yours.",
        sections=[
            (None, ["If your basement only gets wet when it rains, that is useful information. It means the water is coming from outside, driven by the storm, rather than from a plumbing leak or condensation. The next step is working out <em>how</em> it is getting in, because each route has a different fix."]),
            ("1. A crack in the foundation wall", ["Poured concrete walls almost always develop shrinkage cracks. Once the soil outside is saturated, water finds them. Look for a damp streak or staining running down from a crack, often with white mineral deposits along it. A stable vertical crack is usually sealed with <a href=\"/crack-injection/\">epoxy or polyurethane injection</a>."]),
            ("2. The cove joint, where wall meets floor", ["The floor slab and the walls are poured separately, leaving a seam around the edge of the basement. When groundwater rises after heavy rain, it pushes up through that seam. Water appearing evenly along the bottom of a wall, rather than from one crack, is the classic sign. The fix is interior drain tile, which collects the water at the joint and sends it to a sump."]),
            ("3. Water through block or stone walls", ["Concrete block walls are hollow. Water fills the cores and seeps out through the mortar joints or the face of the block. Older stone and brick foundations let water through their joints. Signs include damp patches across the wall and chalky white efflorescence. These walls need drainage rather than injection."]),
            ("4. Sewer backup through the floor drain", ["If water comes up through the floor drain, especially in Chicago and older suburbs with combined sewers, the problem is not your walls at all. The sewer is overloaded and backing up. A <a href=\"/emergency-basement-flooding/\">backflow valve or overhead sewer</a> stops it. Waterproofing the walls will not."]),
            ("5. A window well with no drain", ["A window well that fills during storms will leak through the window frame. Check whether the well has standing water after rain. A blocked or missing drain is a simple repair — see <a href=\"/window-well-drains/\">window well drains</a>."]),
            ("6. A failed or undersized sump pump", ["If you have a sump pump and the basement still floods, the pump may have failed, lost power or been unable to keep up. Pumps that are seven to ten years old, run constantly or have no battery backup are the usual culprits. Read our <a href=\"/learning-center/sump-pump-maintenance-guide/\">sump pump guide</a>."]),
            ("7. Downspouts and grading", ["Gutters that overflow, downspouts that dump water against the house, and soil that slopes toward the foundation all load the walls with water. These are worth fixing whatever else is going on, because they reduce the pressure on any waterproofing system."]),
            ("How to narrow it down", ["Next time it rains, go downstairs and note exactly where the water appears: one crack, along the whole base of a wall, up through the drain or at a window. Take photos. That alone tells a contractor most of what they need to know.",
                                       "If you would like a professional answer, our <a href=\"/wet-basement-repair/\">wet basement inspection</a> is free."]),
        ],
        faqs=[("Is a little water after heavy rain normal?", "No. Even small amounts mean water has a path in, and it usually gets worse over time."),
              ("Can I fix a wet basement myself?", "Clearing gutters, extending downspouts and fixing grading are good DIY steps. Cracks, drain tile and backflow valves are best done by a professional.")],
    ),
    dict(
        slug="interior-vs-exterior-waterproofing",
        title="Interior vs Exterior Basement Waterproofing: Which Do You Need?",
        short="Interior vs Exterior Waterproofing",
        desc="How interior drain tile and exterior waterproofing differ, what each costs in disruption, and which suits Chicago basements, finished basements and older foundations.",
        summary="How the two main approaches work, and why most Chicago homes are waterproofed from inside.",
        sections=[
            (None, ["There are two broad ways to keep water out of a basement: stop it at the outside face of the wall, or let it reach the wall and manage it inside. Both work. Which one is right depends on your house, your lot and what is actually causing the water."]),
            ("Exterior waterproofing", ["The soil is excavated down to the footing along the affected walls. The wall is cleaned and repaired, a waterproof membrane or coating is applied, and new drain tile is laid at the footing before the trench is backfilled.",
                                        "Its strength is that water never reaches the wall. The drawbacks are disruption and cost: landscaping, walks, decks and driveways along that wall are dug up, and in Chicago gangways and tight lots it is often impractical."]),
            ("Interior waterproofing", ["A narrow channel is cut around the inside edge of the basement floor. Perforated drain tile is laid in gravel, and it carries any water from the wall and the cove joint to a sump pit, where a pump sends it outside. A dimpled membrane on the walls directs seepage down into the drain.",
                                        "It does not stop water reaching the wall, but it relieves the pressure that pushes water in and keeps it off the floor. It is installed from inside, in any weather, without touching the yard."]),
            ("Which suits most Chicagoland homes?", ["For most homes we see — bungalows, post-war block foundations and poured suburban basements — interior drain tile with a quality sump and battery backup is the most effective and practical fix. Exterior work makes sense when a wall also needs structural repair from outside, when the basement has no room for a perimeter drain, or for specific walls where outside access is easy."]),
            ("What about finished basements?", ["Interior systems are installed at the perimeter of the floor, so usually only the bottom portion of the drywall along affected walls needs to come out, not the whole room. That is a big reason they are popular in finished basements."]),
            ("The honest answer", ["The right system is the one that addresses how water is getting in. A single leaking crack needs <a href=\"/crack-injection/\">injection</a>, not drain tile. Sewer backup needs a backflow valve. That is why we inspect first. Read more about our <a href=\"/basement-waterproofing/\">basement waterproofing</a> or <a href=\"/french-drain-drain-tile/\">drain tile systems</a>."]),
        ],
        faqs=[("Is interior waterproofing a permanent fix?", "Installed properly with a reliable sump and backup, an interior drain tile system is a long-term solution that we back with written warranty terms."),
              ("Does exterior waterproofing need a sump pump?", "Often, yes. Exterior drain tile still needs somewhere to send the water, which is usually a sump or a storm connection.")],
    ),
    dict(
        slug="foundation-crack-types",
        title="Foundation Cracks: Which Are Normal and Which Need Repair?",
        short="Which Foundation Cracks Need Repair?",
        desc="Vertical, diagonal, horizontal and stair-step foundation cracks explained — what causes each, which are cosmetic and which mean structural movement.",
        summary="What vertical, diagonal, horizontal and stair-step cracks mean for your foundation.",
        sections=[
            (None, ["Almost every basement has a crack somewhere. Most are harmless. A few are early warnings of real structural trouble. The direction, width and behavior of a crack tell you which kind you are looking at."]),
            ("Vertical cracks in poured walls", ["Thin, roughly vertical cracks are usually shrinkage cracks from when the concrete cured. They are the most common and least serious type. The main risk is leaking, which <a href=\"/crack-injection/\">crack injection</a> solves."]),
            ("Diagonal cracks", ["Cracks running at an angle, often from the corner of a window or wall, usually mean one part of the foundation has settled more than another. If they are wider at one end, or the two sides are offset, settlement may still be happening and is worth an assessment. Settlement is stabilized with <a href=\"/helical-push-piers/\">piers</a>."]),
            ("Horizontal cracks", ["A long horizontal crack partway up a wall is the one to take seriously. It usually means soil pressure is pushing the wall inward. Left alone, the wall can bow further. Caught early, it can be held with <a href=\"/carbon-fiber-wall-straps/\">carbon fiber straps</a>; walls that have moved more need <a href=\"/wall-anchors/\">wall anchors or bracing</a>."]),
            ("Stair-step cracks in block walls", ["In concrete block, cracks follow the mortar joints in a stair-step pattern. They can come from settlement or, combined with bowing, from soil pressure. Sight along the wall: if it bulges inward, treat it like a horizontal crack."]),
            ("Signs a crack needs attention now", ["Wider than about 1/8 inch, or wide enough to fit a coin.", "Getting longer or wider over months.", "One side sticking out further than the other.", "Leaking or showing water staining.", "Accompanied by sticking doors, sloping floors or gaps at windows."]),
            ("A simple way to monitor a crack", ["Mark both ends of the crack with a pencil and the date, and measure its width at a few points. Check again every month or two. A crack that stays the same is likely stable. One that grows needs a professional look. Our <a href=\"/foundation-crack-repair/\">foundation crack inspections</a> are free."]),
        ],
        faqs=[("Are hairline cracks in a new home normal?", "Yes, in poured concrete. They are worth sealing if they leak, but they are rarely structural."),
              ("Should I just fill a crack with caulk?", "It hides the crack without sealing it through the wall, and it makes it harder to see whether the crack is moving.")],
    ),
    dict(
        slug="sump-pump-maintenance-guide",
        title="Sump Pump Maintenance &amp; Battery Backups: A Homeowner&rsquo;s Guide",
        short="Sump Pump Maintenance Guide",
        desc="How to test a sump pump, signs it is failing, how long pumps last and why a battery backup matters in Chicagoland storms. A plain-English homeowner checklist.",
        summary="How to test your pump, spot the warning signs and decide whether you need a backup.",
        sections=[
            (None, ["In many Chicagoland homes the sump pump is the single most important thing standing between a storm and a flooded basement. It only works if it is in good shape, and the moment it fails is usually the worst possible moment."]),
            ("Test it before storm season", ["Slowly pour a bucket of water into the pit. The float should rise, the pump should start, empty the pit quickly and switch off. If it hums without pumping, starts late, runs on after the pit is empty or does not start at all, it needs attention."]),
            ("Warning signs of a failing pump", ["Running constantly, even in dry weather.", "Switching on and off every few seconds (short cycling).", "Loud grinding or rattling.", "Visible rust or a stuck float.", "Age: many pumps last around seven to ten years depending on how hard they work."]),
            ("Check the discharge line", ["Water has to leave the house and stay away from it. Make sure the outside discharge is not frozen, crushed or buried, and that it releases well away from the foundation so the same water does not cycle straight back into the pit."]),
            ("Why a battery backup matters", ["Heavy storms and power cuts tend to arrive together. A primary pump without power does nothing. A battery backup pump sits in the same pit and takes over automatically when the power goes out or the main pump fails. For any basement that relies on a sump, it is the most worthwhile upgrade there is."]),
            ("Is your pump the right size?", ["A pump that cannot keep up in a big storm, or one that runs constantly, may be undersized for the water your drain tile collects. Sizing depends on inflow and how high the water has to be lifted. We size pumps to the actual conditions — see <a href=\"/sump-pump-installation/\">sump pump installation and battery backup</a>."]),
            ("Quick annual checklist", ["Test the pump with a bucket of water.", "Clear debris from the pit and the float.", "Check the discharge line outside.", "Test the backup battery and alarm.", "Replace pumps nearing the end of their life before storm season."]),
        ],
        faqs=[("How long does a sump pump last?", "Often around seven to ten years, less if it runs a lot. Age is a good reason to replace before it fails."),
              ("Do I need a backup if I have never flooded?", "If your basement relies on a sump, yes. Most floods happen the first time the main pump fails or the power goes out.")],
    ),
]


def article_body(a):
    out = [f'  <section class="section" aria-label="{a["short"]}">',
           '    <div class="container container--narrow article-body">',
           f'      <p class="article-meta">Prairie Shield Learning Center &middot; Updated October 2026</p>',
           ]
    for heading, ps in a["sections"]:
        if heading:
            out.append(f"      <h2>{heading}</h2>")
        if heading and heading.startswith(("Signs", "Warning", "Quick")):
            out.append("      <ul>" + "".join(f"<li>{p}</li>" for p in ps) + "</ul>")
        else:
            out.extend(f"      <p>{p}</p>" for p in ps)
    out.append('      <div class="article-cta"><p><strong>Want a professional opinion?</strong> Inspections are free across Chicago and the suburbs.</p>'
               '<a class="btn btn--primary" href="#lead-form" data-cta data-location="article">Book a Free Inspection</a></div>')
    out.append("    </div>\n  </section>\n")
    others = [(o["short"], f"{HUB}{o['slug']}/", o["summary"]) for o in ARTICLES if o is not a]
    return "\n".join(out) + article_cards_section("Keep Reading", "More Homeowner Guides", "more-heading", others, grey=True)


def article_page(a):
    path = f"{HUB}{a['slug']}/"
    return dict(
        path=path, title=f"{a['title']} | Prairie Shield", desc=a["desc"], h1=a["title"], lead=a["summary"],
        tagline="Learning Center", og_type="article",
        crumbs=[("Learning Center", HUB), (a["short"], path)],
        form=f"lead-article-{a['slug']}", form_heading="Ask Us About Your Basement", service="Learning Center",
        top_nav=None, body=article_body(a), faqs=a["faqs"], faq_key=a["slug"], faq_heading="Quick Answers",
        cta="Free Inspections Across Chicagoland",
        schema=[{"@type": "Article", "headline": a["title"].replace("&amp;", "&").replace("&rsquo;", "’"),
                 "description": a["desc"], "datePublished": PUBLISHED, "dateModified": PUBLISHED,
                 "author": BIZ, "publisher": BIZ,
                 "mainEntityOfPage": f"https://www.prairieshieldwaterproofing.com{path}"}],
    )


def hub_page():
    items = [(a["short"], f"{HUB}{a['slug']}/", a["summary"]) for a in ARTICLES]
    body = article_cards_section("Homeowner Guides", "Basement &amp; Foundation Guides", "guides-heading", items)
    body += links_section("Services", "Ready for a Repair?", "svc-heading",
                          [("Wet Basement Repair", "/wet-basement-repair/"), ("Basement Waterproofing", "/basement-waterproofing/"),
                           ("Foundation Crack Repair", "/foundation-crack-repair/"), ("Sump Pump Installation", "/sump-pump-installation/")],
                          grey=True)
    return dict(
        path=HUB, title="Learning Center: Basement &amp; Foundation Guides | Prairie Shield",
        desc="Plain-English guides for Chicagoland homeowners: wet basements, foundation cracks, interior vs exterior waterproofing and sump pump care.",
        h1="Learning Center", lead="Straight answers to the questions homeowners ask us most about wet basements, foundation cracks and sump pumps.",
        tagline="Homeowner Guides", crumbs=[("Learning Center", HUB)],
        form="lead-learning-center", form_heading="Ask Us a Question", service="Learning Center",
        body=body, faqs=[("Do you charge to look at my basement?", "No. Inspections and estimates are free across our service area."),
                         ("Which guide should I start with?", "If water is coming in, start with why basements get wet after rain. If you have a crack, read the foundation crack guide.")],
        faq_key="learning-center", faq_heading="Questions", cta="Free Inspections Across Chicagoland",
        schema=[{"@type": "CollectionPage", "name": "Prairie Shield Learning Center",
                 "url": "https://www.prairieshieldwaterproofing.com/learning-center/"}],
    )


def pages():
    return [hub_page()] + [article_page(a) for a in ARTICLES]
