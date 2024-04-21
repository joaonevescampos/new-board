import { connection as knex } from '../../database/connection.js';
import { refreshUpdateDateBoard } from '../../utils/refresh-update-date-board.js';

const createCard = async (req, res) => {
    const { title, board_id } = req.body;

    try {
        const board = await knex('boards').where({ id: board_id }).first();
        if (!board) {
            return res.status(404).json({ message: `Board with board_id = ${board_id} was not found.` });
        }

        const cardAndBoardOwner = await knex('cards')
            .join('boards', 'boards.id', '=', 'cards.board_id')
            .select('user_id as boardOwner')
            .where('cards.id', id)
            .first();

        if (cardAndBoardOwner.boardOwner != req.user.id) {
            return res.status(403).json({ message: 'Denied access.' });
        }

        const numberOfCards = await knex('cards').where({ board_id });
        if (numberOfCards.length >= 10) {
            return res.status(403).json({
                message: `Alert: The maximum number of cards (10) for this board has been reached. ` +
                    `New cards cannot be added to this board due to this limit.`
            });
        }

        const creatingCard = await knex('cards').insert({
            title,
            board_id,
            ordenation: numberOfCards.length
        }).returning('*');

        await refreshUpdateDateBoard(board_id);

        return res.status(201).json(creatingCard[0]);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export { createCard };
