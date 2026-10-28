"""New waterproofing and foundation service pages.

Every service here is one the old Prairie Shield site already offered:
epoxy/polyurethane crack injection, carbon fiber straps, steel wall anchors
and I-beam bracing, window well drains and general wet-basement work.
"""
import hashlib
import os

from build_pages import (ROOT, prose_section, warn_section, cards_section, checklist_section,
                         links_section, WATERPROOFING_LINKS)


def img(name):
    p = os.path.join(ROOT, "assets", "images", name)
    v = hashlib.md5(open(p, "rb").read()).hexdigest()[:8]
    return f"/assets/images/{name}?v={v}"


def related(exclude):
    return [(t, u) for t, u in WATERPROOFING_LINKS if u != exclude][:9]


SERVICES = [
    dict(
        slug="wet-basement-repair", name="Wet Basement Repair", option="Wet Basement Repair",
        title="Wet Basement Repair Chicago | Leaks, Seepage &amp; Damp | Prairie Shield",
        desc="Wet or leaking basement in Chicagoland? We find where the water gets in — cracks, floor joint, sewer backup or high water table — and fix the cause. Free inspection, 24/7.",
        h1="Wet Basement Repair in Chicago &amp; the Suburbs",
        lead="Puddles after rain, a damp smell, wet carpet along one wall — a wet basement always has a cause. We find it, explain it and fix it properly.",
        photo=("photo-wet-basement-repair.webp", "Water seeping in where a basement wall meets the floor", 1200, 901),
        explainer_h="Where the Water Is Really Coming From",
        explainer=[
            "Water gets into basements in a handful of ways, and the fix depends entirely on which one you have. Through a crack in the wall. Through the joint where the wall meets the floor, pushed up by groundwater. Through the wall itself, if it is old block or stone. Back up through a floor drain when the sewer is overloaded. Or down through a window well that has filled like a bucket.",
            "Hardware-store sealers and paint can hide the symptom for a season, but they do not relieve the water pressure behind the wall. The water simply finds the next weak point.",
            "We start with a free inspection, trace the water to its source and then recommend the repair that solves it: crack injection, interior drain tile and a sump, a backflow valve, a window well drain, or a combination. You get a clear written quote before any work starts.",
        ],
        signs=["Puddles on the floor after rain", "Water at the base of the walls", "Damp, musty smell",
               "White chalky deposits on walls", "Water coming up through a floor drain", "Peeling paint or bubbling drywall"],
        benefits=[("The real cause found", "We trace the water, not just mop up after it."),
                  ("One fix, not a guess", "The repair matches how the water is actually getting in."),
                  ("Finished basements protected", "Most work is done from inside with minimal disruption."),
                  ("Healthier air", "Less moisture means less mold and fewer musty smells."),
                  ("Written warranty", "Qualifying work is covered by written warranty terms."),
                  ("24/7 emergency help", "Active flooding? We answer around the clock.")],
        fit=["Water appears after every heavy rain", "The basement smells musty even when it looks dry",
             "You plan to finish the basement and want it dry first", "A previous sealer or patch has failed",
             "Your sump pump runs constantly", "Water comes through the floor drain in storms"],
        faqs=[("Can a wet basement be fixed from inside?",
               "Usually, yes. Interior drain tile, crack injection and sump systems are all installed from inside, with no digging around the house."),
              ("Will waterproofing paint stop my basement leaking?",
               "Not for long. Paint cannot hold back water pushed by groundwater pressure. It is fine for minor dampness, not for leaks."),
              ("Is a wet basement dangerous?",
               "Ongoing moisture feeds mold, damages stored belongings and finishes, and can point to foundation problems. It is worth finding the cause early."),
              ("How much does wet basement repair cost?",
               "It depends on the cause. Sealing one crack costs far less than full drain tile. The inspection is free and the quote is in writing."),
              ("Do you handle sewer backup too?",
               "Yes. If water comes up through the floor drain, a backflow valve or overhead sewer is usually the answer, and we will tell you so.")],
    ),
    dict(
        slug="crack-injection", name="Crack Injection", option="Crack Injection",
        title="Foundation Crack Injection Chicago | Epoxy &amp; Polyurethane | Prairie Shield",
        desc="Leaking foundation crack? Epoxy and polyurethane crack injection seals poured-concrete cracks through the full wall thickness, from inside. Chicagoland, free estimates.",
        h1="Epoxy &amp; Polyurethane Crack Injection",
        lead="A leaking crack in a poured concrete wall is one of the most common — and most fixable — basement problems. Injection seals it through the whole wall, from inside.",
        photo=("photo-crack-injection.webp", "Injection ports set along a sealed crack in a poured basement wall", 900, 1200),
        explainer_h="How Crack Injection Works",
        explainer=[
            "Most poured concrete walls crack as they cure and shrink. Those cracks are rarely structural, but they run right through the wall, and once groundwater finds them they leak.",
            "Injection fills the crack from the inside face all the way through to the soil side. Ports are set along the crack, the surface is sealed, and resin is pumped in at low pressure until it emerges at the next port. Polyurethane foams and stays flexible, which suits leaking cracks that may move slightly with the seasons. Epoxy cures rigid and bonds the concrete back together, which suits cracks that also need strength.",
            "Before injecting we check whether the crack is moving. A crack caused by settlement or soil pressure needs that cause addressed too, and we will tell you if that is the case.",
        ],
        signs=["A vertical crack that leaks after rain", "Damp streaks or staining below a crack", "White mineral deposits along a crack",
               "A crack that has been patched and leaks again", "Hairline cracks in a newer poured basement"],
        benefits=[("Sealed through the full wall", "Resin fills the crack to the outside face, not just the surface."),
                  ("Done from inside", "No digging, no landscaping disturbed."),
                  ("Quick", "Most cracks are sealed in a single visit."),
                  ("The right resin", "Flexible polyurethane or structural epoxy, chosen for your crack."),
                  ("Honest assessment", "We check for movement before we seal anything."),
                  ("Warranty coverage", "Qualifying work is backed by written terms.")],
        fit=["The crack is in poured concrete, not block", "It leaks or shows water staining",
             "It is a single crack or a few, not widespread cracking", "It has not widened noticeably recently",
             "A surface patch has already failed", "You want it sealed before finishing the basement"],
        faqs=[("Epoxy or polyurethane — which is better?",
               "Polyurethane is best for stopping leaks because it stays flexible. Epoxy is best when the crack also needs structural strength. We choose based on the crack."),
              ("Does injection work on block walls?",
               "No. Block walls are hollow, so resin has nowhere to hold. Block leaks are handled with interior drainage instead."),
              ("How long does crack injection last?",
               "Done properly on a stable crack, it is a permanent seal. That is why we check for movement first."),
              ("Can you inject a crack behind finished walls?",
               "We need access to the crack, so a section of drywall usually has to come out. We keep it as small as possible."),
              ("Is a leaking crack a structural problem?",
               "Usually not, if it is vertical in a poured wall. Horizontal or stair-step cracks are different and need a structural assessment.")],
    ),
    dict(
        slug="carbon-fiber-wall-straps", name="Carbon Fiber Wall Straps", option="Carbon Fiber Wall Straps",
        title="Carbon Fiber Wall Straps Chicago | Bowing Wall Repair | Prairie Shield",
        desc="Carbon fiber straps stop bowing basement walls from moving further, with minimal disruption. For block and poured walls with early bowing in Chicagoland. Free inspection.",
        h1="Carbon Fiber Wall Reinforcement",
        lead="When a basement wall has started to bow, carbon fiber straps lock it in place — strong, slim and installed from inside in a day.",
        photo=("photo-carbon-fiber-wall-straps.webp", "Carbon fiber straps installed on a basement wall by Prairie Shield", 1125, 1200),
        explainer_h="Stopping a Bowing Wall Without Rebuilding It",
        explainer=[
            "Wet clay soil expands and presses on basement walls. Over years that pressure can push a wall inward, showing first as a horizontal crack in a poured wall or a stair-step crack in block.",
            "Carbon fiber straps are bonded to the wall with structural epoxy at regular spacing, from floor to the top of the wall, and anchored at the top and bottom. Carbon fiber is many times stronger than steel for its weight, so the straps hold the wall where it is without bulky beams.",
            "Straps stop further movement; they do not push a wall back out. They are the right choice for walls with modest bowing. Walls that have moved further need wall anchors or bracing, and we will tell you which your wall needs after measuring it.",
        ],
        signs=["A horizontal crack in a poured wall", "Stair-step cracks in a block wall", "The wall leans or bows when you sight along it",
               "Cracks that have widened over time", "Gaps between the wall and the floor joists"],
        benefits=[("Movement stopped", "The wall is held where it is."),
                  ("Slim and discreet", "Straps sit almost flush and can be painted or finished over."),
                  ("Fast install", "Typically completed in a day from inside."),
                  ("No digging", "Nothing outside is disturbed."),
                  ("Measured first", "We confirm straps suit your wall before recommending them."),
                  ("Warranty coverage", "Qualifying work backed by written terms.")],
        fit=["Bowing is modest — roughly two inches or less", "The crack is horizontal or stair-step",
             "You want a low-profile repair for a finished space", "The wall has not shifted at the base",
             "You want to stop the problem before it worsens", "You prefer no work outside the house"],
        faqs=[("Can carbon fiber straighten my wall?",
               "No. It stops movement. If the wall needs to be pulled back, wall anchors are the option."),
              ("Will straps work on block walls?", "Yes, on block and poured walls with modest bowing."),
              ("Can I finish over carbon fiber straps?", "Yes. They are thin enough to frame and drywall over."),
              ("How do I know if my wall is bowing too much for straps?",
               "We measure the deflection. Beyond about two inches, or if the base of the wall has slid, anchors or bracing are needed."),
              ("Do I still need waterproofing?",
               "Often, yes. The water that saturates the soil and pushes the wall usually also leaks in. Drainage reduces the pressure too.")],
    ),
    dict(
        slug="wall-anchors", name="Wall Anchors &amp; Bracing", option="Wall Anchors &amp; Bracing",
        title="Basement Wall Anchors &amp; I-Beam Bracing Chicago | Prairie Shield",
        desc="Steel wall anchors hold bowing basement walls and can gradually straighten them; I-beam bracing for severe movement. Chicagoland foundation repair, free inspection.",
        h1="Steel Wall Anchors &amp; I-Beam Bracing",
        lead="For basement walls that have moved more than straps can handle, steel wall anchors hold the wall and can gradually pull it back toward straight.",
        photo=("photo-wall-anchors.webp", "Steel I-beam braces installed along a basement wall by Prairie Shield", 1024, 576),
        explainer_h="Holding — and Recovering — a Bowed Wall",
        explainer=[
            "A wall anchor system has three parts: a steel plate on the inside of the wall, a steel earth anchor set in stable soil out in the yard, and a steel rod connecting the two through the wall. Tightening the rod holds the wall against the soil pressure pushing it in.",
            "Because the anchor can be tightened over time, usually seasonally as the soil moves, the wall can be eased back toward its original position. That is the main advantage over carbon fiber straps, which hold a wall but cannot move it.",
            "Where there is no room in the yard for anchors, for example beside a neighbor&rsquo;s house or a driveway, steel I-beams braced between the floor and the floor framing do the job from inside. We measure the wall and check the site before recommending either.",
        ],
        signs=["A wall bowed more than about two inches", "Horizontal cracks that keep widening",
               "The bottom of the wall has slid inward", "Doors or windows near the wall sticking",
               "Previous repairs that have not held"],
        benefits=[("Holds severe movement", "Built for walls beyond the range of straps."),
                  ("Can straighten over time", "Gradual tightening recovers much of the bow."),
                  ("Far cheaper than rebuilding", "Excavating and replacing a wall costs much more."),
                  ("Bracing where space is tight", "I-beams work when anchors are not possible."),
                  ("Engineered spacing", "Anchors spaced to the wall&rsquo;s length and load."),
                  ("Warranty coverage", "Qualifying work backed by written terms.")],
        fit=["Bowing is roughly two inches or more", "The wall continues to move",
             "There is yard space on that side of the house — or bracing if not", "You want the wall straightened, not just held",
             "A straps-only repair is not enough", "You want to avoid excavation and rebuilding"],
        faqs=[("How far into the yard do anchors go?",
               "Typically around ten feet or more out from the wall, into stable soil. Only small holes are dug at each anchor."),
              ("Will my wall go back to straight?",
               "Often it can be recovered significantly over time with seasonal tightening, but results depend on the wall and soil."),
              ("What if there is no room for anchors?", "We use steel I-beam bracing installed from inside."),
              ("Do anchors damage my landscaping?",
               "Disturbance is limited to small excavations at each anchor point, which we backfill."),
              ("Is a bowed wall an emergency?",
               "Not usually overnight, but movement tends to continue. Stabilizing it sooner is cheaper and safer.")],
    ),
    dict(
        slug="window-well-drains", name="Window Well Drains", option="Window Well Drains",
        title="Window Well Drains &amp; Leaking Basement Windows Chicago | Prairie Shield",
        desc="Basement window leaking when it rains? A window well with no working drain fills with water. We install and repair window well drains tied into your drain tile. Chicagoland.",
        h1="Window Well Drain Repair &amp; Installation",
        lead="If water pours in around a basement window during storms, the window well is usually filling up with nowhere to drain. That is a straightforward fix.",
        photo=("photo-window-well-drains.webp", "Window well with a new drain and gravel base installed by Prairie Shield", 948, 1200),
        explainer_h="Why Window Wells Flood",
        explainer=[
            "A window well is a small pit dug against the foundation so a basement window can sit below ground. It should have gravel at the bottom and a drain that carries water down to the foundation drain tile. Over time that drain clogs with silt and leaves, or it was never connected in the first place.",
            "When it rains hard, the well fills like a bucket. Once the water is above the bottom of the window, it leaks through the frame and runs down the wall, often looking like a foundation leak.",
            "We clear or install a drain from the well to your drain tile or sump, renew the gravel bed, and fit a cover if it helps keep debris and snow out. If your basement has no drain tile, we can connect the well to an interior system.",
        ],
        signs=["Water entering around a basement window", "Standing water in the window well after rain",
               "Staining on the wall below a window", "Rotting or rusting window frames", "Leaves and silt filling the well"],
        benefits=[("Leak stopped at the window", "Water drains away before it reaches the glass."),
                  ("Connected properly", "Tied into drain tile or your sump system."),
                  ("Cleaner wells", "Fresh gravel and optional covers keep debris out."),
                  ("Protects the frame", "No more standing water rotting the window."),
                  ("Quick repair", "Usually done in a single visit."),
                  ("Honest diagnosis", "We confirm the window well is the source first.")],
        fit=["Water comes in at the window during storms", "The well holds water after rain",
             "The well has no visible drain", "Leaves and soil have filled the gravel",
             "The window frame is damaged by water", "You want a cover to keep snow and debris out"],
        faqs=[("Why is my basement window leaking?",
               "Most often the window well is filling with water because its drain is blocked or missing."),
              ("Can you add a drain to an existing window well?",
               "Yes. We dig down inside the well and connect a drain to the footing drain tile or to an interior system."),
              ("Do window well covers help?",
               "They keep out leaves, snow and much of the rain, which reduces the load on the drain. They are not a substitute for one."),
              ("What if my house has no drain tile?",
               "We can route the well drain to an interior drain tile and sump system."),
              ("Is this part of a larger waterproofing job?",
               "It can be done on its own, or alongside drain tile and sump work if the basement leaks elsewhere too.")],
    ),
]


def page(sv):
    path = f"/{sv['slug']}/"
    photo = sv.get("photo")
    ph = (img(photo[0]), photo[1], photo[2], photo[3]) if photo else None
    body = warn_section("Warning Signs", "Sound Familiar?", "warns-heading", sv["signs"],
                        sub="If any of these are happening in your basement, a free inspection will tell you why.", grey=True)
    body += prose_section("In Plain English", sv["explainer_h"], "explainer-heading", sv["explainer"], photo=ph)
    body += cards_section("What You Get", "What This Means for Your Home", "benefits-heading", sv["benefits"])
    body += checklist_section("Is This You?", "This Is a Good Fit If…", "fit-heading", sv["fit"])
    body += links_section("Related", "Related Services", "related-heading", related(path), grey=True)
    return dict(
        path=path, title=sv["title"], desc=sv["desc"], h1=sv["h1"], lead=sv["lead"],
        crumbs=[("Services", "/services/"), (sv["name"], path)],
        form=f"lead-{sv['slug']}", form_heading=f"Free {sv['name']} Estimate", service=sv["option"].replace("&amp;", "&"),
        preselect=sv["option"], nav="subnav-foundation", body=body, faqs=sv["faqs"], faq_key=sv["slug"],
        faq_heading=f"{sv['name']} Questions", cta=f"Get a Free {sv['name']} Estimate",
        schema=[{"@type": "Service", "name": sv["name"].replace("&amp;", "&"), "serviceType": sv["name"].replace("&amp;", "&"),
                 "provider": {"@id": "https://www.prairieshieldwaterproofing.com/#business"},
                 "areaServed": {"@type": "AdministrativeArea", "name": "Chicagoland, Illinois"}}],
    )


def pages():
    return [page(s) for s in SERVICES]
