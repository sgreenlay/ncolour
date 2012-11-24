Description
-
ncolour is a two player web 'card' game designed/developed in 7 hours for #sehackathon 8.

Rules
-
- Each player starts with 20 coloured 'cards', 5 of each colour. Value of colours are initialized 6, 3, 2, 1.
- Turns are taken simultaneously.
    - Each player chooses two 'cards':
        - The first is a 'lie' to the opponent telling them the card you intend to play
        - The second is a 'truth', the card you are playing
    - When both players have chosen their cards, the resolve occurs:
        - The players discards their chosen cards. If the 'lie' was true they only discard 1 card, if not they discard 2 cards.
        - If both players play different truths, they score based on value of the colour. However, if both players choose the same 'truth', neither gains points and the point values rotate (highest value becomes least and every other increases to the next value).
- The game ends when one player runs out of cards
