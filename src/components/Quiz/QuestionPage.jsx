export default function QuestionPage({ q, index, selected, onSelect, disabled }) {
    return (
    <div>
        <h5>Question {index + 1} of 10</h5>
        <p>{q.text}</p>

        <img
        src={q.image}
        alt={`Sign for question ${index + 1}`}
        style={{ width: 120, height: 120, objectFit: 'contain' }}
        className="mb-3"
        />

        <div className="d-flex gap-2">
        {q.options.map((opt, i) => (
            <button
            key={i}
            className={`btn ${selected === i ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => !disabled && onSelect(q.id, i)}
            disabled={disabled}
            >
            {opt}
            </button>
        ))}
        </div>
    </div>
    );
}